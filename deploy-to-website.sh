#!/usr/bin/env bash
set -euo pipefail

echo "Committing everything..."
git commit -am "Do something" || true # This is a 1-person project so this is ok

echo "Pulling changes..."
git pull

echo "Installing root deps (workspaces)…"
npm ci

echo "Building frontend and backend…"
npm run -w frontend build
npm run -w backend build   # make sure backend has a build script: "tsc -p backend/tsconfig.json"

echo "Staging build artifacts…"
git add -A frontend/dist backend/dist

# Avoid failing if no changes
#if ! git diff --cached --quiet; then
echo "Committing…"
git commit -m "build: update dist" || true
echo "Pushing main…"
git push

echo "Reset remote 'website' to main…"

# No need to be soft, there should be no changes on website branch
git push -f origin main:website

git checkout main
echo "Done!"
