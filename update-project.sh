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
BACKEND_DIR="$REPO/backend/dist"
FRONTEND_DIR="$REPO/frontend/dist"
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
  # printf 'Subject: Website ERROR\n\nSomething failed: %s \n\n(exit %s)' "$cmd" "$status" | msmtp dungewar@gmail.com || true
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
pm2 --version
APP_NAME="dungewar-backend"
SCRIPT_PATH="$BACKEND_DIR/server.js"

## TODO: have it restart instead of delete srsly

# Run compiled JS with Node (no ts-node flags)
pm2 restart "$APP_NAME" || (
pm2 start "$SCRIPT_PATH" --name "$APP_NAME" --cwd "$BACKEND_DIR" && \
  echo "Saving server, but this is like idk what this does so delete probably..." && \
  pm2 save
) || (echo "Wasn't able to restart or start server" && false)

echo "[$(timestamp)] Backend restarted..."


echo "[$(timestamp)] Sending emails..."
cd "$START_DIR"
./send-update-email.sh dungewar@gmail.com "Just testing..."

echo "[$(timestamp)] Update complete."
