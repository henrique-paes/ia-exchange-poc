# PR-U8 — feat(frontend): add Tag type + Book.tags (T17)

- **Branch:** `feat/tag-u8-fetypes` ← `feat/agents-poc`
- **Commit:** `0c109f9 feat(frontend): add Tag type + Book.tags (T17)`
- **Tarefa:** T17 · **Camada:** frontend (types)

## Arquivos
- `frontend/src/api/types.ts` — `interface Tag { id, name, createdAt }`; `Book.tags: Tag[]`
- `frontend/src/pages/BooksPage.test.tsx` — mock helper +`tags: []`
- `frontend/src/pages/RentalsPage.test.tsx` — mock +`tags: []`

## Nota de escopo
Campo `tags` obrigatório em `Book` quebraria a compilação dos mocks existentes →
ajuste mínimo `tags: []` nos 2 testes (autorizado p/ manter build verde).

## Testes
`npx tsc --noEmit` → **0 erros**. `vite build` falhou só por Node local ≠ 24 (ambiente,
não código) — validar definitivo via `docker compose exec -T frontend npm run build`.

## Critério de aceite
Atendido: `Tag` exportado, `Book.tags` disponível, type-check verde.
