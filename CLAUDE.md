# Development Harness

This file is **always loaded**. Every change follows it. Three pillars: **logs**,
**tests**, **git**. Together they answer: *where did execution go* (logs), *was it
correct* (tests), *what changed and why* (git).

---

## Method: SDD + TDD

Work flows through [`TASKS.md`](./TASKS.md) cards. Per card, in order:

1. **Spec** — write/confirm the relevant `docs/specs/*.md` before any code.
2. **Red** — write a failing test that encodes the spec.
3. **Green** — implement until the test passes.
4. **Refactor** — clean up; tests stay green.
5. **Commit** — one logical change, clear message (see Git).

No production code without a failing test first. No test without a spec it traces to.

---

## Pillar 1 — Logs (where execution passed by)

Goal: read the logs and reconstruct the execution path without a debugger.

- **Structured JSON logs**, one line per event. Backend logger: `pino`.
- Log at **boundaries**, not every line:
  - request in / response out (method, path, status, duration ms)
  - use-case start / end (e.g. `rental.rent`, `book.create`)
  - external calls (db query intent, not payloads)
  - every caught error (with cause)
- **Levels**: `error` (failed, needs attention) · `warn` (recovered/degraded) ·
  `info` (boundary events, default in prod) · `debug` (detail, dev only).
- **Correlation**: attach a `requestId` per HTTP request; include it in every log
  line for that request so a flow is greppable end to end.
- **Never log** secrets, tokens, full request bodies, or PII (CPF, email, phone).
  Mask before logging.
- Message shape: `{ level, time, requestId, event, ...context, msg }`.

> Acceptance: for any feature, you can `grep` the `event` names and see the path
> taken (entry → use-case → db → exit) for a single `requestId`.

---

## Pillar 2 — Tests (correct per spec)

Goal: a green suite means the code matches the specs.

- Every behavior in `docs/specs/*.md` has at least one test.
- **Backend**: jest + supertest (`backend/tests/`, `*.test.ts`).
- **Frontend**: vitest + React Testing Library (`*.test.tsx`).
- Test names cite the spec rule: `describe('rental.rent')` →
  `it('rejects renting an unavailable book (rental.md §availability)')`.
- **Red before green**: see the test fail for the right reason first.
- Test behavior, not implementation. Assert on outputs/status/state, not internals.
- A bug fix starts with a failing test that reproduces it.
- Keep tests fast and isolated; no shared mutable state between tests.

Run:

```bash
# in docker
docker compose exec -T backend npm test
docker compose exec -T frontend npm test
# local (node 24)
cd backend && npm test
cd frontend && npm test
```

> Acceptance: never check a `TASKS.md` box until its spec's tests are green.

---

## Pillar 3 — Git (retrospect + controlled execution)

Goal: history reads as the project's story; any state is recoverable and explained.

- **One logical change per commit.** Don't mix scaffold + feature + fix.
- **Conventional Commits**: `type(scope): subject`
  - types: `feat` `fix` `chore` `docs` `test` `refactor` `ci`
  - subject ≤ 50 chars, imperative ("add", not "added")
  - body explains **why** when not obvious; wrap ~72 cols
- **Branch off `main`**; never commit features straight to `main`.
- Commit only when a step is **green** (tests pass) — broken commits don't land.
- Reference the card: e.g. `feat(rental): rent use case (CARD-022)`.
- Commit footer:

  ```
  Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
  ```

> Acceptance: `git log --oneline` alone explains what shipped and in what order.

---

## The loop (every unit of work)

```
spec ──▶ failing test ──▶ implement ──▶ logs at boundaries ──▶ green ──▶ commit
  ▲                                                                        │
  └──────────────────────── next card ◀───────────────────────────────────┘
```

If any pillar is missing — no spec, no test, no log trace, no clean commit —
the work is not done.

---

## Project quick facts

- Stack: React+TS (Vite) · Node+TS (Express+Prisma) · Postgres · Docker · Node 24
- Run: `docker compose up -d` → frontend `:5173`, backend `:3001`, db `:5432`
- Backend host port is **3001** (3000 avoided; configurable via `BACKEND_PORT`)
- Tests: backend jest+supertest, frontend vitest+RTL
- Data policy: never log/store/expose CPF, email, or phone in plaintext.
