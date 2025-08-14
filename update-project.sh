#!/bin/bash
# To have it throw errors for undefined variables

LOG_DIR="../dungewar-personal-website-data/logs"
LOG_FILE="$LOG_DIR/pull.log"
BACKEND_DIR="./backend"
REPO="/srv/dungewar-personal-website"
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
  # send alert email (add proper headers if you like)
  printf 'Subject: Website ERROR\n\nSomething failed: %s (exit %s)\n' "$cmd" "$status" | msmtp dungewar@gmail.com || true
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

  echo "[$(timestamp)] Installing backend dependencies..."
  cd "$BACKEND_DIR"
  npm install

  echo "[$(timestamp)] Building TypeScript (may take a while)..."
  "$BACKEND_DIR/node_modules/.bin/tsc"

  echo "[$(timestamp)] Restarting backend with pm2..."
  APP_NAME="dungewar-backend"
  SCRIPT_PATH="dist/server.js"

  pm2 restart "$APP_NAME" --update-env >/dev/null 2>&1 \
    || pm2 start "$SCRIPT_PATH" --name "$APP_NAME" --update-env >/dev/null


  # Wait until PM2 reports the app as online (with a timeout so we don't hang forever)
  MAX_WAIT=120  # seconds
  WAITED=0
  while ! pm2 info "$APP_NAME" | grep -qE 'status\s*online'; do
    sleep 1
    WAITED=$((WAITED+1))
    if [ "$WAITED" -ge "$MAX_WAIT" ]; then
      echo "[$(timestamp)] PM2 did not report '$APP_NAME' online within ${MAX_WAIT}s."
      break
    fi
  done


#  echo -e "Subject: Website update!\n\nThe website has been updated, new changes include $(echo "cheese (placeholder)")\nHope to see you while you're sleeping soon!" | msmtp dungewar@gmail.com
  cd "$START_DIR"
  ./send-update-email.sh dungewar@gmail.com "Just testing..."
  ./send-update-email.sh rohan.nadkarni123@gmail.com "Just testing..."

  echo "[$(timestamp)] Update complete."
}