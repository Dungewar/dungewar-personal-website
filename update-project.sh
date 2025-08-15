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
  SCRIPT_PATH="$BACKEND_DIR/dist/server.js"


  pm2 restart "$APP_NAME" --update-env >/dev/null 2>&1 \
    || pm2 start "$SCRIPT_PATH" --name "$APP_NAME" --update-env >/dev/null

  echo "[$(timestamp)] Backend restarted..."

  # After pm2 (re)start
  PORT=3000
  MAX_WAIT=120
  START=$(date +%s)
  NEXT=12  # print every 12s

  check_ready() {
    curl -fsS --connect-timeout 1 --max-time 2 "http://127.0.0.1:$PORT/health" >/dev/null 2>&1
  }

  while ! check_ready; do
    sleep 1
    now=$(date +%s); elapsed=$(( now - START ))

    # print catch-up updates at 12s, 24s, 36s, ...
    while (( elapsed >= NEXT )); do
      echo "[$(timestamp)] waited ${NEXT}s..."
      NEXT=$(( NEXT + 12 ))
    done

    if (( elapsed >= MAX_WAIT )); then
      echo "[$(timestamp)] Backend not healthy within ${MAX_WAIT}s."
      break
    fi
  done



#  echo -e "Subject: Website update!\n\nThe website has been updated, new changes include $(echo "cheese (placeholder)")\nHope to see you while you're sleeping soon!" | msmtp dungewar@gmail.com
  cd "$START_DIR"
  ./send-update-email.sh dungewar@gmail.com "Just testing..."
  ./send-update-email.sh rohan.nadkarni123@gmail.com "Just testing..."

  echo "[$(timestamp)] Update complete."
}