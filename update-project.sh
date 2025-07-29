#!/bin/bash

LOG_DIR="/srv/dungewar-personal-website/logs"
LOG_FILE="$LOG_DIR/pull.log"
BACKEND_DIR="/srv/dungewar-personal-website/backend"

mkdir -p "$LOG_DIR"

timestamp() {
  date +"%Y-%m-%d %H:%M:%S"
}

{
  echo "[$(timestamp)] Pulling latest changes..."
  git -C /srv/dungewar-personal-website pull

  echo "[$(timestamp)] Installing backend dependencies..."
  cd "$BACKEND_DIR" || exit
  npm install

  echo "[$(timestamp)] Building TypeScript..."
  "$BACKEND_DIR/node_modules/.bin/tsc"

  echo "[$(timestamp)] Restarting backend with pm2..."
  pm2 restart dist/server.js --name dungewar-backend || pm2 start dist/server.js --name dungewar-backend

  echo "[$(timestamp)] Update complete."
} 2>&1 | tee -a "$LOG_FILE"