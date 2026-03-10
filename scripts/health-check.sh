#!/usr/bin/env bash
set -euo pipefail
WORKDIR=/home/jordan/.openclaw/workspace
LOG=/home/jordan/.openclaw/workspace/.automation/health-check.log
STATUS_JSON=/tmp/openclaw_status.json
FAIL_COUNT_FILE=/home/jordan/.openclaw/workspace/.automation/health-fail-count
NOTIFY_SH=/home/jordan/.openclaw/workspace/Repositories/mission-control/scripts/notify.sh

openclaw status --json > "$STATUS_JSON" || true
jq '.' "$STATUS_JSON" > /dev/null 2>&1 || true

# basic checks
GATEWAY_REACHABLE=$(jq -r '.gateway.reachable // "false"' "$STATUS_JSON")
GATEWAY_ERROR=$(jq -r '.gateway.error // ""' "$STATUS_JSON")
USAGE=$(jq -r '.usage // {}' "$STATUS_JSON")
MC_HEALTH_CODE=200

# check mission-control UI
MC_OK=1
HTTP_CODE=$(curl -s -o /tmp/mc.html -w '%{http_code}' http://localhost:4010/ || echo 000)
if [ "$HTTP_CODE" != "200" ]; then
  MC_OK=0
fi

if [ "$GATEWAY_REACHABLE" != "true" ] || [ "$MC_OK" -ne 1 ]; then
  echo "[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] unhealthy: gateway_reachable=$GATEWAY_REACHABLE mc_ok=$MC_OK gateway_error=$GATEWAY_ERROR" >> "$LOG"
  FAILS=0
  [ -f "$FAIL_COUNT_FILE" ] && FAILS=$(cat "$FAIL_COUNT_FILE" || echo 0)
  FAILS=$((FAILS+1))
  echo "$FAILS" > "$FAIL_COUNT_FILE"
  # only auto-restart on first and fifth consecutive failures
  if [ "$FAILS" -le 5 ] && ( [ "$FAILS" -eq 1 ] || [ "$FAILS" -eq 5 ] ); then
    echo "[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] attempting gateway restart" >> "$LOG"
    openclaw gateway restart >> "$LOG" 2>&1 || echo "gateway restart failed" >> "$LOG"
    sleep 6
    # restart mission control server
    pkill -f 'Repositories/mission-control/node_modules/.bin/next' || true
    (cd /home/jordan/.openclaw/workspace/Repositories/mission-control && nohup npm run start > .automation/prod-server.log 2>&1 &) || true
    # notify if notification configured
    if [ -x "$NOTIFY_SH" ]; then
      "$NOTIFY_SH" --title "Mission Control auto-restart" --body "Gateway restart attempted due to health check (fails=$FAILS)." || true
    fi
  fi
else
  echo "[$(date -u +'%Y-%m-%d:%TZ')] healthy" >> "$LOG"
  rm -f "$FAIL_COUNT_FILE" || true
fi

# send healthy notification once when recovered
if [ "$GATEWAY_REACHABLE" = "true" ] && [ "$MC_OK" -eq 1 ]; then
  if [ -f "/home/jordan/.openclaw/workspace/.automation/health-notified" ]; then
    rm -f "/home/jordan/.openclaw/workspace/.automation/health-notified" || true
  fi
else
  touch "/home/jordan/.openclaw/workspace/.automation/health-notified"
fi

# Keep recent logs trimmed
mkdir -p /home/jordan/.openclaw/workspace/.automation
tail -n 500 "$LOG" > "$LOG.tmp" || true
mv "$LOG.tmp" "$LOG" || true
