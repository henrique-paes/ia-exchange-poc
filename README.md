# Library System

A small library where **users** can **create books** and **rent books**.

- **Frontend:** React + TypeScript (Vite)
- **Backend:** Node.js + TypeScript (Express + Prisma)
- **Database:** PostgreSQL
- **Method:** SDD (Spec-Driven Development) + TDD (Test-Driven Development)

## Layout

```
.
├── backend/      Node + TypeScript API (Express + Prisma)
├── frontend/     React + TypeScript app (Vite)
├── docker/       Dockerfiles + nginx config
├── docs/         Specs (SDD) and architecture
├── docker-compose.yml
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

> Requires Node.js 18+ (20 LTS recommended).

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

## Method

Every feature card in [`TASKS.md`](./TASKS.md) follows:

1. Write/confirm the spec in `docs/specs/`.
2. Write a failing test (**red**).
3. Implement until it passes (**green**).
4. Refactor + review.
