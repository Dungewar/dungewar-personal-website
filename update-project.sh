#!/bin/bash
# To have it throw errors for undefined variables
set -u

LOG_DIR="/srv/dungewar-personal-website/logs"
LOG_FILE="$LOG_DIR/pull.log"
BACKEND_DIR="/srv/dungewar-personal-website/backend"

mkdir -p "$LOG_DIR"

timestamp() {
  date +"%Y-%m-%d %H:%M:%S"
}

{
  echo "[$(timestamp)] Received request to update website."

  echo "[$(timestamp)] Stashing changes..."
  git stash

  echo "[$(timestamp)] Pulling latest changes..."
  git -C /srv/dungewar-personal-website pull

  echo "[$(timestamp)] Installing backend dependencies..."
  cd "$BACKEND_DIR" || exit
  npm install

  echo "[$(timestamp)] Building TypeScript (may take a while)..."
  "$BACKEND_DIR/node_modules/.bin/tsc"

  echo "[$(timestamp)] Restarting backend with pm2..."
  APP_NAME="dungewar-backend"
  SCRIPT_PATH="dist/server.js"

  # Try restart; if that fails (e.g., first deploy), start it.
  if ! pm2 restart "$SCRIPT_PATH" --name "$APP_NAME" --update-env >/dev/null 2>&1; then
    pm2 start "$SCRIPT_PATH" --name "$APP_NAME" --update-env >/dev/null 2>&1
  fi

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

  echo "[$(timestamp)] Update complete."
} 2>&1 | tee -a "$LOG_FILE"