#!/usr/bin/env bash
# Minimal notifier that posts to a configured webhook (Discord or other)
set -euo pipefail
WEBHOOK_URL_FILE=~/.openclaw/notify_webhook
TITLE="${1:-Notification}"
BODY="${2:-}" 
if [ -f "$WEBHOOK_URL_FILE" ]; then
  WEBHOOK=$(cat "$WEBHOOK_URL_FILE")
  jq -n --arg t "$TITLE" --arg b "$BODY" '{content: ($t + " - " + $b)}' | curl -s -X POST -H "Content-Type: application/json" -d @- "$WEBHOOK" >/dev/null 2>&1 || true
fi

echo "$TITLE: $BODY"
