# PR-U4 — feat(books): Book ⇄ Tags relation (T8-T12)

- **Branch:** `feat/tag-u4-bookrel` ← `feat/agents-poc`
- **Commits:**
  - `a8a93ed feat(books): add tagIds to createBookSchema and updateBookSchema (T8)`
  - `0736d5c feat(books): extend BookRepository with tags include, update, and filter (T9)`
  - `7c0d4d2 test(books): add book.service tests for tags relation (T10 RED)`
  - `deee900 feat(books): inject TagRepository and implement tags logic in BookService (T11)`
  - `065649c feat(books): add updateBook handler and PATCH /books/:id route (T12)`
- **Tarefa:** T8-T12 · **Camada:** backend (books module)

## Cobertura de regras
- `book.tags.optional` (tagIds opcional zod uuid[]) · `book.tags.exists` (findManyByIds all-or-nothing → NotFoundError 404 antes de escrita) · `book.tags.unique` (dedup `new Set`) · `book.tags.set` (PATCH `tags:{set}` substitui; omitir preserva) · `book.update.noFields` (`.refine` body vazio) · `book.filterByTags` (`AND: tagIds.map(some)`) · hidratação `include:{tags:true}`.
- PATCH `/books/:id`; filtro params repetidos normalizados (string|string[]→string[]).

## Testes
`docker compose exec -T backend npm test` → **50/50** (5 suites). `rental.service.test` confirmado verde (fake BookService não quebra com `list` param opcional). Logs `book.create`/`book.update` só `bookId` (sem PII).

## Critério de aceite
Atendido integralmente.
