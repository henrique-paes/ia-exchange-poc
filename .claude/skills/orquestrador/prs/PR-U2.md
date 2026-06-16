# PR-U2 — feat(db): add Tag model + Book<->Tag m2m relation (T1,T2)

- **Branch:** `feat/tag-u2-prisma` ← `feat/agents-poc`
- **Commit:** `25d50dc feat(db): add Tag model + Book<->Tag m2m relation (T1,T2)`
- **Tarefa:** T1, T2 · **Camada:** backend/db

## Arquivos
- `backend/prisma/schema.prisma` — model `Tag`, `Book.tags` (m2m implícita → `_BookToTag`)
- `backend/prisma/migrations/20260616193009_add_tag/migration.sql`
- `backend/tests/helpers/db.ts` — `resetDb` limpa tags (rentals→books→tags→users)

## Decisões
- `name` SEM `@unique` nativo — unicidade case-insensitive fica no service (T6).
- Junção `_BookToTag` com `ON DELETE CASCADE`.

## Testes
`docker compose exec -T backend npm test` → **22/22 passed** (3 suites). Nada quebrou.

## Critério de aceite
Atendido: tipos `Tag` + `Book.tags` gerados; migration aplica em banco limpo; suíte verde; `resetDb` sem violação de FK.
