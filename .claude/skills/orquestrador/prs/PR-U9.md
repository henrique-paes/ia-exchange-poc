# PR-U9 — feat(tags): frontend Tags page + API + nav (T18-T21)

- **Branch:** `feat/tag-u9-fetags` ← `feat/agents-poc`
- **Commits:**
  - `73fd653 feat(tags): add tags API client (T18)`
  - `f88dfda feat(tags): add TagsPage with TDD tests (T19/T20)`
  - `234336e feat(tags): add /tags route and Tags nav link (T21)`
- **Tarefa:** T18-T21 · **Camada:** frontend

## Arquivos
- `frontend/src/api/tags.ts` — `listTags`, `createTag` (wrapper fino).
- `frontend/src/pages/TagsPage.tsx` — useAsync + form (Input aria-label `tag name`, Button desabilitado trim 1-40/submitting), erro 409 via toApiMessage, estado vazio.
- `frontend/src/pages/TagsPage.test.tsx` — 7 casos (lista/vazio/desabilitado required+length+valid/submit trimado+reload/erro 409).
- `frontend/src/App.tsx` — `/tags` route. `frontend/src/components/Layout.tsx` — NavLink Tags (active link).

## Testes
`docker compose exec -T frontend npm test` → **21/21** (9 arquivos). `tsc --noEmit` ok.

## Nota
Avisos `act(...)` em App.test.tsx são preexistentes (BooksPage), não introduzidos aqui.

## Critério de aceite
Atendido: rota/nav, form com validações, erro 409, suíte verde.
