#!/usr/bin/env bash
set -euo pipefail

require() {
  local bin="$1"
  if ! command -v "$bin" >/dev/null 2>&1; then
    echo "[doctor] Missing ${bin}. Please install it and retry."
    return 1
  fi
}

echo "[doctor] Environment check"
require node
require npm
require git

node_version=$(node -v)
npm_version=$(npm -v)

echo "[doctor] Node: ${node_version}"
echo "[doctor] npm: ${npm_version}"

if [[ -f package.json ]]; then
  echo "[doctor] package.json detected."
fi

echo "[doctor] Suggested commands:"
echo "  npm install"
echo "  npm run verify"
