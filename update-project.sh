#!/bin/bash
# To have it throw errors for undefined variables
SKIP_STUFF=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    -l|--light)  # the flag you want
      SKIP_STUFF=true
      shift
      ;;
    *)
      shift
      ;;
  esac
done



REPO="/srv/dungewar-personal-website"
LOG_DIR="$REPO/../dungewar-personal-website-data/logs"
LOG_FILE="$LOG_DIR/pull.log"
BACKEND_DIR="$REPO/backend"
FRONTEND_DIR="$REPO/frontend"
START_DIR="$(pwd -P)"

mkdir -p "$LOG_DIR"

exec > >(tee -a "$LOG_FILE") 2>&1
set -Eeuo pipefail

timestamp() {
  date +"%Y-%m-%d %H:%M:%S"
}

failure() {
  local status="$1" cmd="$2"
  echo "[$(timestamp)] ERROR $status while running: $cmd"
  echo "Current directory: $(pwd -P)"
  # send alert email (add proper headers if you like)
  printf 'Subject: Website ERROR\n\nSomething failed: %s \n\n(exit %s)' "$cmd" "$status" | msmtp dungewar@gmail.com || true
  exit "$status"
}
# Pass failing status + command into failure()
trap 'failure "$?" "$BASH_COMMAND"' ERR



echo "[$(timestamp)] Received request to update website."

if ! $SKIP_STUFF; then
#    echo "[$(timestamp)] Stashing changes..."
#    git -C "$REPO" stash #push -u -m "auto-update $(date +'%F %T')"
#
#    echo "[$(timestamp)] Pulling latest changes..."
#    git -C "$REPO" pull --ff-only

  echo "[$(timestamp)] Installing backend dependencies..."
  cd "$BACKEND_DIR"
  npm ci --omit=src
  # cd "$BACKEND_DIR" && npm i -D ts-node typescript

  echo "[$(timestamp)] Skipping frontend install (serving built assets)..."
#    cd "$FRONTEND_DIR"
#    npm ci --omit=src
else
  echo "[$(timestamp)] Skipping backend dependencies and TS building because -l was passed."
fi


echo "[$(timestamp)] Restarting backend with pm2..."
APP_NAME="dungewar-backend"
SCRIPT_PATH="$BACKEND_DIR/dist/server.js"

# Safer existence check
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  echo "[$(timestamp)] Backend exists, deleting it to restart…"
  pm2 delete "$APP_NAME" || true
fi

# Run compiled JS with Node (no ts-node flags)
pm2 start node --name "$APP_NAME" \
  --cwd "$BACKEND_DIR" \
  -- "$SCRIPT_PATH"

pm2 save


echo "[$(timestamp)] Backend restarted..."


echo "[$(timestamp)] Sending emails..."
cd "$START_DIR"
./send-update-email.sh dungewar@gmail.com "Just testing..."

echo "[$(timestamp)] Update complete."
