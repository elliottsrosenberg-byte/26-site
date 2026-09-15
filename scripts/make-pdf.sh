#!/bin/bash
# Renders /pdf to elliott-rosenberg-portfolio.pdf with headless Chrome.
# Run from the repo root: bash scripts/make-pdf.sh
set -e
cd "$(dirname "$0")/.."
npx astro build
npx astro preview --port 4399 &
PREVIEW=$!
trap "kill $PREVIEW 2>/dev/null" EXIT
sleep 2
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="elliott-rosenberg-portfolio.pdf" \
  "http://localhost:4399/pdf/"
echo "Wrote elliott-rosenberg-portfolio.pdf"
