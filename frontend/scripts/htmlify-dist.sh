#!/usr/bin/env bash
set -euo pipefail

DIST_DIR="dist"
CSS="$DIST_DIR/styles/dark-style.css"
NAV_BAR="$DIST_DIR/partials/navbar.html"

# Convert every .md in DIST_DIR to .html (mirrors filename, same folder)
# Safe for spaces/newlines via -print0 / read -d ''.
while IFS= read -r -d '' f; do
  out="${f%.md}.html"

  # Title from first ATX H1; fallback to filename
  title="$(grep -m1 -E '^[[:space:]]*# ' "$f" | sed -E 's/^[[:space:]]*# //')"
  if [ -z "${title:-}" ]; then title="$(basename "${f%.md}")"; fi

  pandoc -f gfm -t html5 --standalone \
         --css "$CSS" \
         --embed-resources \
         --include-before-body="$NAV_BAR" \
         --metadata "pagetitle=$title" \
         -o "$out" "$f"
done < <(find "$DIST_DIR" -type f -name '*.md' -print0)