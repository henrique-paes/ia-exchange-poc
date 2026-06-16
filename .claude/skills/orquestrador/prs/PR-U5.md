# PR-U5 — test(integration): tags API + book<->tags e2e (T13)

- **Branch:** `feat/tag-u5-integ` ← `feat/agents-poc`
- **Commit:** `a43f94f test(integration): tags API + book<->tags e2e (T13)`
- **Tarefa:** T13 · **Camada:** testes (supertest)

## Arquivos
- `backend/tests/integration/api.test.ts` — +10 casos (sem duplicar os 2 de filtro da U4)

## Cobertura
- `tags API`: create+read-back (201), `tag.name.unique` 409 case-insensitive, list name asc, GET id desconhecido 404, name inválido 400.
- `books ⇄ tags`: create com tagIds → 201 hidratado; `book.tags.exists` 404 + book não persistido; `book.tags.unique` dedup; `book.tags.set` PATCH substitui/preserva/limpa; `GET ?tagIds=` AND/match-all + tags completas.

## Testes
`docker compose exec -T backend npm test` → **62/62** (10 novos + 52). Verde direto (impl já mergeada em ondas anteriores). Sem PII.

## Critério de aceite
Atendido.
