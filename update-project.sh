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

  if ! $SKIP_STUFF; then
    echo "[$(timestamp)] Installing backend dependencies..."
    cd "$BACKEND_DIR"
    npm install

    echo "[$(timestamp)] Building TypeScript (may take a while)..."
    "./node_modules/.bin/tsc"
  else
    echo "Skipping backend dependencies and TS building because -l was passed."
  fi


  echo "[$(timestamp)] Restarting backend with pm2..."
  APP_NAME="dungewar-backend"
  SCRIPT_PATH="dist/server.js"

  pm2 restart "$APP_NAME" --update-env >/dev/null 2>&1 \
    || pm2 start "$SCRIPT_PATH" --name "$APP_NAME" --update-env >/dev/null

  echo "[$(timestamp)] Backend restarted..."

  # Wait until PM2 reports the app as online (with a timeout so we don't hang forever)
  MAX_WAIT=120   # seconds
  WAITED=0
  STEPS=10       # number of progress updates
  REACHED=1      # next step to announce (1..STEPS)

  while ! pm2 info "$APP_NAME" 2>/dev/null | grep -qE 'status[[:space:]]*online'; do
    sleep 1
    ((WAITED+=1))
    echo "Waiting... $WAITED"

    # announce when WAITED/MAX_WAIT >= REACHED/STEPS  ->  WAITED*STEPS >= MAX_WAIT*REACHED
    if (( REACHED <= STEPS && WAITED >= (MAX_WAIT / STEPS) * REACHED )); then
      echo "[$(timestamp)] Reached [$REACHED/$STEPS] of max wait"
      ((REACHED+=1))
    fi

    if (( WAITED >= MAX_WAIT )); then
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