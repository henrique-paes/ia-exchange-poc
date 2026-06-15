# Library System

A small library where **users** can **create books** and **rent books**.

- **Frontend:** React + TypeScript (Vite)
- **Backend:** Node.js + TypeScript (Express + Prisma)
- **Database:** PostgreSQL
- **Method:** SDD (Spec-Driven Development) + TDD (Test-Driven Development)

## Architecture

```
┌────────────┐   HTTP/JSON    ┌─────────────────────────────┐   SQL   ┌──────────┐
│  Frontend  │ ─────────────▶ │           Backend           │ ──────▶ │ Postgres │
│ React+Vite │  :3001 (dev)   │  Express + Prisma (Node 24) │  :5432  │   16     │
│   :5173    │ ◀───────────── │                             │ ◀────── │          │
└────────────┘                └─────────────────────────────┘         └──────────┘

Backend is layered per module (users / books / rentals):
  routes ──▶ controller ──▶ service (rules) ──▶ repository (Prisma) ──▶ DB
                              ▲ depends on a repository *interface*, so
                                domain rules are unit-tested without a DB.
Cross-cutting: pino request logging (x-request-id), zod validation,
central error handler → { error: { code, message, details } }.
```

## Layout

```
.
├── backend/      Node + TypeScript API (Express + Prisma); src/modules/{users,books,rentals}
├── frontend/     React + TypeScript app (Vite); src/{api,hooks,components,pages}
├── docker/       Dockerfiles + nginx config
├── docs/         specs/ (SDD) + SPECS.md index
├── scripts/      smoke.sh — end-to-end flow check
├── docker-compose.yml
├── CLAUDE.md     Development harness (logs + tests + git)
└── TASKS.md      Development task cards
```

## Run with Docker (recommended)

```bash
cp .env.example .env
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:3001  (host port; container listens on 3000)
- Postgres: localhost:5432

> Host ports are configurable in `.env` (`BACKEND_PORT`, `FRONTEND_PORT`). Backend
> defaults to **3001** to avoid clashing with other local dev servers on 3000.

## Local development

> Requires Node.js 24 (see `.nvmrc`). With nvm: `nvm install && nvm use`.

Backend:

```bash
cd backend
npm install
npm run dev          # start API
npm test             # run tests
npm run test:watch   # TDD watch mode
```

Frontend:

```bash
cd frontend
npm install
npm run dev
npm test
```

## API

See [`docs/specs/api.md`](./docs/specs/api.md). Summary:

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | liveness |
| POST | `/users` | create user `{ name }` |
| GET | `/users` · `/users/:id` | list · get user |
| GET | `/users/:id/rentals` | a user's rentals |
| POST | `/books` | create book `{ title, author, creatorId }` |
| GET | `/books` · `/books/:id` | list · get book |
| POST | `/rentals` | rent `{ userId, bookId }` |
| POST | `/rentals/:id/return` | return a rental |

Smoke-test the full flow against a running stack:

```bash
BASE=http://localhost:3001 ./scripts/smoke.sh
```

## Environment variables

Root `.env` (compose) — copy from `.env.example`:

| Var | Default | Purpose |
|-----|---------|---------|
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | `library` | Postgres credentials |
| `BACKEND_PORT` | `3001` | host port → backend container `:3000` |
| `FRONTEND_PORT` | `5173` | host port → frontend container `:5173` |

Backend (`backend/.env`, see `backend/.env.example`): `PORT`, `NODE_ENV`, `DATABASE_URL`.
Frontend (`frontend/.env`): `VITE_API_URL` (backend base URL the browser calls).

## Method

Work follows the harness in [`CLAUDE.md`](./CLAUDE.md). Every card in
[`TASKS.md`](./TASKS.md):

1. Write/confirm the spec in `docs/specs/`.
2. Write a failing test (**red**).
3. Implement until it passes (**green**), logging at boundaries.
4. Refactor + review, then commit (one logical change, conventional message).

## Known limitations & next steps

- **No auth/authz** — any caller can create users/books and rent on anyone's
  behalf. Add authentication before real use.
- **Integration tests share the dev database** (`resetDb` clears rows). Run
  `docker compose exec backend npm run seed` to restore samples. A dedicated
  test database would isolate this.
- **No pagination** on list endpoints; fine for a POC, not for scale.
- **Rentals have no due dates / fines** — out of scope for the current spec.
- Frontend styling is minimal (functional, unstyled).
