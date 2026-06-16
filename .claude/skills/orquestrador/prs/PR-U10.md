# PR-U10 — feat(books): integrate tags in Books UI (T22-T26)

- **Branch:** `feat/tag-u10-febooks` ← `feat/agents-poc`
- **Commits:**
  - `46c99ba feat(api): add updateBook, tagIds to createBook/listBooks (T22)`
  - `3789e01 feat(ui): add TagPicker controlled multi-select component (T23)`
  - `16614a4 feat(books): integrate TagPicker into BooksPage create/edit/filter (T24/T25)`
  - `c47d482 test(books): extend BooksPage tests for tag integration (T26)`
- **Tarefa:** T22-T26 · **Camada:** frontend

## Arquivos
- `api/books.ts` — `updateBook` (PATCH), `createBook(tagIds?)`, `listBooks(tagIds?)` (params repetidos manual).
- `components/TagPicker.tsx` (+css) — controlado, fieldset+checkboxes, dedup onChange, aria-label.
- `pages/BooksPage.tsx` (+css) — create envia tagIds; BookRow pills (`book tags`); edit inline updateBook+reload; filtro toolbar (`filter by tags`) server-side.
- `pages/BooksPage.test.tsx` — +4 casos (create tagIds / pills / filtro listBooks / edit updateBook).

## Testes
`docker compose exec -T frontend npm test` → **25/25** (9 arquivos). `tsc --noEmit` ok. Filtro gera `?tagIds=a&tagIds=b`.

## Atenção (revisar)
- `BooksPage` passou a chamar `listTags`; `App.test.tsx` não mocka `../api/tags` → warning `act()`. Suíte ainda verde, mas avaliar se exige mock no App.test.tsx (possível chamada de rede não tratada).

## Critério de aceite
Atendido.
