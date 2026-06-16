# Library System — Development Tasks

Stack: React + TypeScript (frontend), Node.js + TypeScript (backend), Docker.
Method: **SDD** (Spec-Driven Development) + **TDD** (Test-Driven Development).

Domain: a library where **users** can **create books** and **rent books**.

> Workflow per card: write spec → write failing test (red) → implement (green) → refactor.
> Check the box only when spec is written, tests pass, and code is reviewed.

---

## Phase 0 — Project Structure & Tooling

### CARD-001: Repository scaffold

- [x] Create monorepo layout: `/backend`, `/frontend`, `/docs`, `/docker`
- [x] Add root `README.md` describing project + run instructions
- [x] Add root `.gitignore` (node_modules, dist, .env, coverage)
- [x] Add `docs/SPECS.md` index file for SDD specs

### CARD-002: Backend tooling

- [x] Init `backend` with `npm init` + TypeScript (`tsconfig.json`)
- [x] Add Express (or Fastify), config loader, `src/` + `tests/` dirs
- [x] Add Jest + ts-jest + supertest for TDD
- [x] Add ESLint + Prettier
- [x] Add npm scripts: `dev`, `build`, `test`, `test:watch`, `lint`

### CARD-003: Frontend tooling

- [x] Init `frontend` with Vite + React + TypeScript
- [x] Add Vitest + React Testing Library for TDD
- [x] Add ESLint + Prettier
- [x] Add npm scripts: `dev`, `build`, `test`, `test:watch`, `lint`
- [x] Add API client base (axios/fetch wrapper) with base URL from env

### CARD-004: Docker structure

- [x] `docker/backend.Dockerfile` (multi-stage: build + run)
- [x] `docker/frontend.Dockerfile` (build + nginx serve)
- [x] `docker-compose.yml` wiring frontend, backend, db (postgres)
- [x] Add `.env.example` for compose
- [x] Add volumes for db persistence + hot reload in dev
- [x] Verify `docker compose up` brings full stack online

### CARD-005: Database & migrations

- [x] Choose ORM (Prisma) + add to backend
- [x] Define schema: `User`, `Book`, `Rental`
- [x] Add migration tooling + first migration
- [x] Add seed script with sample data

### CARD-006: CI pipeline (optional but recommended)

- [x] Add pipeline running `lint` + `test` for backend and frontend
- [x] Fail build on test failure or coverage drop

---

## Phase 1 — Specs (SDD)

### CARD-010: Write domain specs first

- [x] `docs/specs/user.md` — user fields, validation rules
- [x] `docs/specs/book.md` — book fields, who can create, validation
- [x] `docs/specs/rental.md` — rent rules, return rules, availability, limits
- [x] `docs/specs/api.md` — REST endpoints, request/response shapes, error codes
- [x] Review specs before writing any test

---

## Phase 2 — Backend Execution (TDD)

### CARD-020: User domain

- [x] Spec: confirm `docs/specs/user.md`
- [x] Test: user model validation (red)
- [x] Impl: user model + repository (green)
- [x] Test: `POST /users`, `GET /users/:id` (red)
- [x] Impl: user endpoints (green)
- [x] Refactor + review

### CARD-021: Book domain

- [x] Spec: confirm `docs/specs/book.md`
- [x] Test: book model validation (red)
- [x] Impl: book model + repository (green)
- [x] Test: `POST /books` (create by user), `GET /books`, `GET /books/:id` (red)
- [x] Impl: book endpoints (green)
- [x] Refactor + review

### CARD-022: Rental domain — core

- [x] Spec: confirm `docs/specs/rental.md`
- [x] Test: rent a book — marks unavailable, links user+book (red)
- [x] Impl: rent use case + endpoint `POST /rentals` (green)
- [x] Test: cannot rent already-rented book (red)
- [x] Impl: availability guard (green)
- [x] Refactor + review

### CARD-023: Rental domain — return & rules

- [x] Test: return a book — marks available again (red)
- [x] Impl: return use case + endpoint `POST /rentals/:id/return` (green)
- [x] Test: rental limit per user enforced (red)
- [x] Impl: limit rule (green)
- [x] Test: list rentals for a user `GET /users/:id/rentals` (red)
- [x] Impl: list endpoint (green)
- [x] Refactor + review

### CARD-024: Error handling & validation middleware

- [x] Test: invalid payloads return 400 with consistent shape (red)
- [x] Impl: validation + error middleware (green)
- [x] Test: not-found returns 404 (red)
- [x] Impl: 404 handling (green)

### CARD-025: Integration tests

- [x] End-to-end flow: create user → create book → rent → return (via supertest)
- [x] Run against dockerized db

---

## Phase 3 — Frontend Execution (TDD)

### CARD-030: App shell & routing

- [x] Test: app renders, routes resolve (red)
- [x] Impl: router + layout (green)

### CARD-031: Users UI

- [x] Test: user list + create form (red)
- [x] Impl: user page + API calls (green)

### CARD-032: Books UI

- [x] Test: book list renders (red)
- [x] Impl: book list page (green)
- [x] Test: create-book form validates + submits (red)
- [x] Impl: create-book form (green)

### CARD-033: Rentals UI

- [x] Test: rent button disabled when unavailable (red)
- [x] Impl: rent action + state (green)
- [x] Test: return button + my-rentals list (red)
- [x] Impl: return action + rentals view (green)

### CARD-034: API integration & error states

- [x] Test: loading + error states rendered (red)
- [x] Impl: error/loading handling (green)

---

## Phase 4 — Wire-up & Delivery

### CARD-040: Full-stack run

- [x] `docker compose up` serves frontend talking to backend talking to db
- [x] Smoke test the create→rent→return flow in browser

### CARD-041: Docs & handoff

- [x] Update README with architecture diagram + run steps
- [x] Document env vars
- [x] Record known limitations + next steps

---

## Phase 5 — UI Styling (TDD)

Specs: [`docs/specs/ui-style.md`](./docs/specs/ui-style.md) (standard) +
[`docs/specs/ui-components.md`](./docs/specs/ui-components.md).

### CARD-050: Design tokens + global base

- [x] Spec: confirm `ui-style.md`
- [x] Add `src/styles/tokens.css` (light + dark via prefers-color-scheme)
- [x] Add `src/styles/global.css` (reset + base elements), import both in `main.tsx`
- [x] Verify dark mode flips with OS preference

### CARD-051: UI primitives

- [ ] Test + impl `Button` (primary/secondary/ghost/danger, disabled, focus)
- [ ] Test + impl `Input` + `Select` (focus, invalid, disabled)
- [ ] Test + impl `Field`/form layout + `StatusPill`
- [ ] Refactor `AsyncBoundary` to spec (spinner, error + Retry)

### CARD-052: Apply to pages

- [ ] Style `Layout` + `Nav` (active link, responsive)
- [ ] Restyle Users/Books/Rentals pages with primitives + card lists
- [ ] Empty states for each list
- [ ] Keep existing page tests green; add focus/disabled assertions where useful
