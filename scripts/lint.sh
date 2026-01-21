#!/usr/bin/env bash
set -euo pipefail

if [[ -f package.json ]]; then
  npm run lint
else
  echo "lint: package.json not found; skipping."
fi
