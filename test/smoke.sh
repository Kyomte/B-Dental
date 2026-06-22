#!/usr/bin/env bash
# Frontend smoke test: builds demo config, serves public/ on a free port, and
# greps the served assets for anchors that prove the SPA shell is wired.
# Byte-level only — no DB, no headless browser. Exits non-zero on any failure.
#
# Run from the repo root:  bash test/smoke.sh   (or: npm run test:smoke)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-5193}"
PUBLIC="$ROOT/public"
LOG="$(mktemp)"

cleanup() {
  if [[ -n "${PID:-}" ]] && kill -0 "$PID" 2>/dev/null; then
    kill "$PID" 2>/dev/null || true
    wait "$PID" 2>/dev/null || true
  fi
  rm -f "$LOG"
}
trap cleanup EXIT

fail() { echo "✗ $*" >&2; [[ -s "$LOG" ]] && cat "$LOG" >&2; exit 1; }
pass() { echo "✓ $*"; }

# Build demo config so public/config.js exists and is in demo mode.
( cd "$ROOT" && BDENTAL_DEMO=1 node build.js ) >/dev/null || fail "build.js failed"
grep -q '"demo":true' "$PUBLIC/config.js" || fail "config.js not in demo mode after build"
pass "build.js wrote demo config.js"

echo "→ Launching http.server on :$PORT (root=$PUBLIC)"
( cd "$PUBLIC" && python3 -m http.server "$PORT" ) >"$LOG" 2>&1 &
PID=$!

for _ in {1..25}; do
  curl -fsS -o /dev/null "http://127.0.0.1:$PORT/index.html" && break
  sleep 0.2
done

HTML="$(curl -fsS "http://127.0.0.1:$PORT/index.html")" || fail "index.html did not respond"
grep -q 'B-Dental' <<<"$HTML" || fail "index.html missing brand name"
grep -q 'id="toastHost"' <<<"$HTML" || fail "index.html missing toast host"
grep -q 'app.js' <<<"$HTML" || fail "index.html does not load app.js"
pass "index.html serves the SPA shell"

APP="$(curl -fsS "http://127.0.0.1:$PORT/app.js")" || fail "app.js did not respond"
grep -q 'validatePatient' <<<"$APP" || fail "app.js missing patient validation"
grep -q 'toast-action' <<<"$APP" || fail "app.js missing retry-toast wiring"
pass "app.js carries validation + retry UI"

CSS="$(curl -fsS "http://127.0.0.1:$PORT/styles.css")" || fail "styles.css did not respond"
grep -q 'toast-action' <<<"$CSS" || fail "styles.css missing retry-toast styles"
pass "styles.css carries retry-toast styles"

echo "✓ smoke passed"
