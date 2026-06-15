# Library System — Development Tasks

Stack: React + TypeScript (frontend), Node.js + TypeScript (backend), Docker.
Method: **SDD** (Spec-Driven Development) + **TDD** (Test-Driven Development).

Domain: a library where **users** can **create books** and **rent books**.

> Workflow per card: write spec → write failing test (red) → implement (green) → refactor.
> Check the box only when spec is written, tests pass, and code is reviewed.

---

## Phase 0 — Project Structure & Tooling

### CARD-001: Repository scaffold
- [ ] Create monorepo layout: `/backend`, `/frontend`, `/docs`, `/docker`
- [ ] Add root `README.md` describing project + run instructions
- [ ] Add root `.gitignore` (node_modules, dist, .env, coverage)
- [ ] Add `docs/SPECS.md` index file for SDD specs

### CARD-002: Backend tooling
- [ ] Init `backend` with `npm init` + TypeScript (`tsconfig.json`)
- [ ] Add Express (or Fastify), config loader, `src/` + `tests/` dirs
- [ ] Add Jest + ts-jest + supertest for TDD
- [ ] Add ESLint + Prettier
- [ ] Add npm scripts: `dev`, `build`, `test`, `test:watch`, `lint`

### CARD-003: Frontend tooling
- [ ] Init `frontend` with Vite + React + TypeScript
- [ ] Add Vitest + React Testing Library for TDD
- [ ] Add ESLint + Prettier
- [ ] Add npm scripts: `dev`, `build`, `test`, `test:watch`, `lint`
- [ ] Add API client base (axios/fetch wrapper) with base URL from env

### CARD-004: Docker structure
- [ ] `docker/backend.Dockerfile` (multi-stage: build + run)
- [ ] `docker/frontend.Dockerfile` (build + nginx serve)
- [ ] `docker-compose.yml` wiring frontend, backend, db (postgres)
- [ ] Add `.env.example` for compose
- [ ] Add volumes for db persistence + hot reload in dev
- [ ] Verify `docker compose up` brings full stack online

### CARD-005: Database & migrations
- [ ] Choose ORM (Prisma/TypeORM/Knex) + add to backend
- [ ] Define schema: `User`, `Book`, `Rental`
- [ ] Add migration tooling + first migration
- [ ] Add seed script with sample data

### CARD-006: CI pipeline (optional but recommended)
- [ ] Add pipeline running `lint` + `test` for backend and frontend
- [ ] Fail build on test failure or coverage drop

---

## Phase 1 — Specs (SDD)

### CARD-010: Write domain specs first
- [ ] `docs/specs/user.md` — user fields, validation rules
- [ ] `docs/specs/book.md` — book fields, who can create, validation
- [ ] `docs/specs/rental.md` — rent rules, return rules, availability, limits
- [ ] `docs/specs/api.md` — REST endpoints, request/response shapes, error codes
- [ ] Review specs before writing any test

---

## Phase 2 — Backend Execution (TDD)

### CARD-020: User domain
- [ ] Spec: confirm `docs/specs/user.md`
- [ ] Test: user model validation (red)
- [ ] Impl: user model + repository (green)
- [ ] Test: `POST /users`, `GET /users/:id` (red)
- [ ] Impl: user endpoints (green)
- [ ] Refactor + review

### CARD-021: Book domain
- [ ] Spec: confirm `docs/specs/book.md`
- [ ] Test: book model validation (red)
- [ ] Impl: book model + repository (green)
- [ ] Test: `POST /books` (create by user), `GET /books`, `GET /books/:id` (red)
- [ ] Impl: book endpoints (green)
- [ ] Refactor + review

### CARD-022: Rental domain — core
- [ ] Spec: confirm `docs/specs/rental.md`
- [ ] Test: rent a book — marks unavailable, links user+book (red)
- [ ] Impl: rent use case + endpoint `POST /rentals` (green)
- [ ] Test: cannot rent already-rented book (red)
- [ ] Impl: availability guard (green)
- [ ] Refactor + review

### CARD-023: Rental domain — return & rules
- [ ] Test: return a book — marks available again (red)
- [ ] Impl: return use case + endpoint `POST /rentals/:id/return` (green)
- [ ] Test: rental limit per user enforced (red)
- [ ] Impl: limit rule (green)
- [ ] Test: list rentals for a user `GET /users/:id/rentals` (red)
- [ ] Impl: list endpoint (green)
- [ ] Refactor + review

### CARD-024: Error handling & validation middleware
- [ ] Test: invalid payloads return 400 with consistent shape (red)
- [ ] Impl: validation + error middleware (green)
- [ ] Test: not-found returns 404 (red)
- [ ] Impl: 404 handling (green)

### CARD-025: Integration tests
- [ ] End-to-end flow: create user → create book → rent → return (via supertest)
- [ ] Run against dockerized db

---

## Phase 3 — Frontend Execution (TDD)

### CARD-030: App shell & routing
- [ ] Test: app renders, routes resolve (red)
- [ ] Impl: router + layout (green)

### CARD-031: Users UI
- [ ] Test: user list + create form (red)
- [ ] Impl: user page + API calls (green)

### CARD-032: Books UI
- [ ] Test: book list renders (red)
- [ ] Impl: book list page (green)
- [ ] Test: create-book form validates + submits (red)
- [ ] Impl: create-book form (green)

### CARD-033: Rentals UI
- [ ] Test: rent button disabled when unavailable (red)
- [ ] Impl: rent action + state (green)
- [ ] Test: return button + my-rentals list (red)
- [ ] Impl: return action + rentals view (green)

### CARD-034: API integration & error states
- [ ] Test: loading + error states rendered (red)
- [ ] Impl: error/loading handling (green)

---

## Phase 4 — Wire-up & Delivery

### CARD-040: Full-stack run
- [ ] `docker compose up` serves frontend talking to backend talking to db
- [ ] Smoke test the create→rent→return flow in browser

### CARD-041: Docs & handoff
- [ ] Update README with architecture diagram + run steps
- [ ] Document env vars
- [ ] Record known limitations + next steps
