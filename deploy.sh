#!/bin/bash
# deploy.sh — sync nikhco-landing to Vultr VPS

set -e

REMOTE_USER="root"
REMOTE_HOST="45.77.220.66"
REMOTE_PATH="/var/www/html/nikhco/"
LOCAL_PATH="$(dirname "$0")/"

echo "→ Deploying to ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}"

rsync -avz --delete \
  --exclude='.git/' \
  --exclude='.DS_Store' \
  --exclude='.claude/' \
  --exclude='deploy.sh' \
  --exclude='README.md' \
  "$LOCAL_PATH" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}"

echo "✓ Done."
