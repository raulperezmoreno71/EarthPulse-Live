#!/usr/bin/env sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
RUNTIME_DIR="$ROOT_DIR/.runtime"
mkdir -p "$RUNTIME_DIR"

(cd "$ROOT_DIR/backend" && ./mvnw spring-boot:run -q) >"$RUNTIME_DIR/backend.log" 2>"$RUNTIME_DIR/backend-error.log" &
echo $! >"$RUNTIME_DIR/backend.pid"

(cd "$ROOT_DIR/frontend" && if [ ! -d node_modules ]; then npm ci; fi && npm run dev -- --host 127.0.0.1) >"$RUNTIME_DIR/frontend.log" 2>"$RUNTIME_DIR/frontend-error.log" &
echo $! >"$RUNTIME_DIR/frontend.pid"

echo "[EarthPulse] Iniciado: http://localhost:5173"
echo "[EarthPulse] Logs: $RUNTIME_DIR"
