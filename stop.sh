#!/usr/bin/env sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
RUNTIME_DIR="$ROOT_DIR/.runtime"

for service in backend frontend; do
  pid_file="$RUNTIME_DIR/$service.pid"
  if [ -f "$pid_file" ]; then
    pid=$(cat "$pid_file")
    kill "$pid" 2>/dev/null || true
    rm -f "$pid_file"
  fi
done

echo "[EarthPulse] Procesos detenidos."
