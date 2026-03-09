#!/usr/bin/env bash
set -euo pipefail
# dev-prestart.sh
# Kills processes listening on configured ports (if any), waits for them to exit,
# then returns success so the caller can start a dev server on the desired port.

PORTS=${PORTS:-"4010 4000"} # default ports to check (mission-control, optionsTaxHub)
FORCE_KILL=${FORCE_KILL:-0}  # if 1, send SIGKILL after SIGTERM wait
WAIT_SECONDS=${WAIT_SECONDS:-5}

echo "[dev-prestart] checking ports: $PORTS"

for p in $PORTS; do
  # Find PIDs listening on the port (IPv4 or IPv6)
  pids=$(lsof -tiTCP:$p -sTCP:LISTEN || true)
  if [ -n "$pids" ]; then
    echo "[dev-prestart] port $p is in use by PID(s): $pids"
    echo "[dev-prestart] sending SIGTERM to $pids"
    kill $pids || true
    # wait a bit
    sleep $WAIT_SECONDS
    # check if still alive
    still=$(ps -o pid= -p $pids 2>/dev/null || true)
    if [ -n "$still" ]; then
      if [ "$FORCE_KILL" -eq 1 ]; then
        echo "[dev-prestart] processes still alive, sending SIGKILL to $pids"
        kill -9 $pids || true
      else
        echo "[dev-prestart] processes still alive after SIGTERM; leaving them (set FORCE_KILL=1 to force)."
      fi
    else
      echo "[dev-prestart] port $p freed"
    fi
  else
    echo "[dev-prestart] port $p is free"
  fi
done

exit 0
