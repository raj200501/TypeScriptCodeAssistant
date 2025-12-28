#!/usr/bin/env bash
set -euo pipefail

PORT=${PORT:-5055}
export PORT
LOG_FILE="/tmp/typescript-code-assistant-backend.log"

npm run dev --workspace backend -- --port "$PORT" >"$LOG_FILE" 2>&1 &
SERVER_PID=$!

cleanup() {
  kill "$SERVER_PID" >/dev/null 2>&1 || true
}
trap cleanup EXIT

for _ in {1..20}; do
  if curl -s "http://localhost:$PORT/health" >/dev/null; then
    break
  fi
  sleep 0.25
done

response=$(curl -s -X POST "http://localhost:$PORT/api/suggestions" \
  -H 'Content-Type: application/json' \
  -d '{"code":"const x = 1;"}')

echo "$response" | grep -q "suggestion"

snippet_response=$(curl -s -X POST "http://localhost:$PORT/api/snippets" \
  -H 'Content-Type: application/json' \
  -d '{"title":"Demo snippet","code":"const greet = (name: string) => console.log(name);","language":"typescript","tags":["demo","smoke"]}')

snippet_id=$(echo "$snippet_response" | python - <<'PY'
import json,sys
data=json.load(sys.stdin)
print(data.get('id',''))
PY
)

curl -s "http://localhost:$PORT/api/snippets/$snippet_id" | grep -q "Demo snippet"

analysis_response=$(curl -s -X POST "http://localhost:$PORT/api/snippets/$snippet_id/analyze")
echo "$analysis_response" | grep -q "suggestions"

echo "Smoke test passed"
