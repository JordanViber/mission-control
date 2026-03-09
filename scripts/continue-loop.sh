#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$ROOT/.automation"
LOG_FILE="$LOG_DIR/continue-loop.log"
STATUS_FILE="$LOG_DIR/status.txt"
NEXT_FILE="$ROOT/docs/NEXT_STEPS.md"

mkdir -p "$LOG_DIR"
cd "$ROOT"

{
  echo "==== $(date -Is) continue-loop ===="
  echo "repo: $ROOT"
  echo "branch: $(git branch --show-current 2>/dev/null || true)"
  echo "head: $(git rev-parse --short HEAD 2>/dev/null || true)"
  echo ""
  echo "git status --short"
  git status --short || true
  echo ""
  echo "running build..."
  npm run build
  echo ""
  echo "next steps snapshot:"
  if [ -f "$NEXT_FILE" ]; then
    sed -n '1,160p' "$NEXT_FILE"
  else
    echo "NEXT_STEPS.md missing"
  fi
  echo ""
  echo "continue-loop completed successfully"
} >> "$LOG_FILE" 2>&1

{
  echo "Last run: $(date -Is)"
  echo "Repo: $ROOT"
  echo "Branch: $(git branch --show-current 2>/dev/null || true)"
  echo "Head: $(git rev-parse --short HEAD 2>/dev/null || true)"
  echo "Build: OK"
  echo "Log: $LOG_FILE"
} > "$STATUS_FILE"
