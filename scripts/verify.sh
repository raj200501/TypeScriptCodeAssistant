#!/usr/bin/env bash
set -euo pipefail

if [[ ! -f package.json ]]; then
  echo "verify: package.json not found; skipping."
  exit 0
fi

has_script() {
  local script="$1"
  node -e "const pkg=require('./package.json');process.exit(pkg.scripts && pkg.scripts['${script}'] ? 0 : 1)"
}

run_script() {
  local script="$1"
  if has_script "$script"; then
    echo "\n==> npm run ${script}\n"
    npm run "$script"
  else
    echo "\n==> Skipping ${script} (not defined)\n"
  fi
}

run_script format
run_script lint
run_script typecheck
run_script test
run_script test:integration
run_script test:e2e
run_script build
run_script smoke
