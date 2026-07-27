#!/usr/bin/env bash
# Run this directly on the production machine (over SSH, or from a cron/systemd
# timer) to deploy the latest main. Requires a production .env already sitting
# in the repo root (see DEPLOYMENT.md) — Vite bakes VITE_* vars from it into
# the build at build time, this script never writes secrets itself.
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "Missing .env in $(pwd) — create it from .env.example with production values first (see DEPLOYMENT.md)." >&2
  exit 1
fi

echo "==> Pulling latest main"
git fetch origin main
git checkout main
git pull --ff-only origin main

echo "==> Installing dependencies"
npm ci

echo "==> Lint"
npm run lint

echo "==> Build (Vite bakes in VITE_* from .env at build time)"
npm run build

echo "==> Publishing to nginx web root"
sudo rsync -a --delete dist/ /var/www/hopin-client/

echo "==> Done"
