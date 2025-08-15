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


{
  echo "[$(timestamp)] Received request to update website."

  echo "[$(timestamp)] Stashing changes..."
  git -C "$REPO" stash #push -u -m "auto-update $(date +'%F %T')"

  echo "[$(timestamp)] Pulling latest changes..."
  git -C "$REPO" pull --ff-only

  if ! $SKIP_STUFF; then
    echo "[$(timestamp)] Installing backend dependencies..."
    cd "$BACKEND_DIR"
    npm install

  else
    echo "Skipping backend dependencies and TS building because -l was passed."
  fi


  echo "[$(timestamp)] Restarting backend with pm2..."
  APP_NAME="dungewar-backend"
  SCRIPT_PATH="$BACKEND_DIR/server.ts"
  INTERPRETER="$BACKEND_DIR/node_modules/.bin/ts-node"

  PM2_BIN="$(command -v pm2)" || { echo "pm2 not found"; exit 1; }

  "$PM2_BIN" restart "$APP_NAME" --update-env >/dev/null 2>&1 \
    || "$PM2_BIN" start "$SCRIPT_PATH" \
         --name "$APP_NAME" \
         --interpreter "$INTERPRETER" \
         --cwd "$BACKEND_DIR" \
         --update-env

  echo "[$(timestamp)] Backend restarted..."


  echo "[$(timestamp)] Sending emails..."
  cd "$START_DIR"
  ./send-update-email.sh dungewar@gmail.com "Just testing..."
  ./send-update-email.sh rohan.nadkarni123@gmail.com "Just testing..."

  echo "[$(timestamp)] Update complete."
}