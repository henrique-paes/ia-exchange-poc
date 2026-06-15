#!/usr/bin/env bash
# End-to-end smoke test: drives the create -> rent -> return flow against a
# running backend (the same endpoints the browser UI calls). Usage:
#   BASE=http://localhost:3001 ./scripts/smoke.sh
set -euo pipefail

BASE="${BASE:-http://localhost:3001}"

jqid() { python3 -c 'import sys,json;print(json.load(sys.stdin)["id"])'; }
field() { python3 -c "import sys,json;print(json.load(sys.stdin)[\"$1\"])"; }

echo "health: $(curl -fsS "$BASE/health")"

user=$(curl -fsS -X POST "$BASE/users" -H 'content-type: application/json' \
  -d '{"name":"Smoke Tester"}' | jqid)
echo "created user $user"

book=$(curl -fsS -X POST "$BASE/books" -H 'content-type: application/json' \
  -d "{\"title\":\"Smoke Book\",\"author\":\"QA\",\"creatorId\":\"$user\"}" | jqid)
echo "created book $book (available=$(curl -fsS "$BASE/books/$book" | field available))"

rental=$(curl -fsS -X POST "$BASE/rentals" -H 'content-type: application/json' \
  -d "{\"userId\":\"$user\",\"bookId\":\"$book\"}" | jqid)
echo "rented: book available=$(curl -fsS "$BASE/books/$book" | field available) (expect False)"

curl -fsS -X POST "$BASE/rentals/$rental/return" >/dev/null
echo "returned: book available=$(curl -fsS "$BASE/books/$book" | field available) (expect True)"

count=$(curl -fsS "$BASE/users/$user/rentals" | python3 -c 'import sys,json;print(len(json.load(sys.stdin)))')
echo "user rentals: $count"
echo "SMOKE OK"
