# REVIEW-U10 — ciclo 1

**Branch:** `feat/tag-u10-febooks` · **Veredito:** REQUEST CHANGES (1 🔴, 3 🟡) · Suíte 25/25 (com warning act)

## 🔴 Crítico
- `App.test.tsx` — BooksPage agora chama `listTags` (`BooksPage.tsx:172`) mas App.test.tsx só mocka books/users/rentals → `listTags` real dispara `api.get('/tags')` em teste unitário; warning `act(...)` confirmado; quebra isolamento (Pilar 2). Fix: `vi.mock('./api/tags', () => ({ listTags: vi.fn().mockResolvedValue([]), createTag: vi.fn() }))`.

## 🟡 Sugestões
- `BooksPage.tsx:166-170` — `deps:[filterTagIds.join(',')]` + eslint-disable; documentar o porquê.
- `BooksPage.tsx:108` — `selectedTagIds` só inicializa na montagem; resetar de `book.tags` ao abrir edição (§3.1 pré-popula).
- `TagPicker`/§2.3 — erro 404 `book.tags.exists` não tratado na UI (backend valida); backlog.

## 🟢
- listBooks params repetidos sem tocar client.ts; updateBook PATCH parcial; TagPicker controlado/dedup/acessível/sem XSS; pills `book tags`; testes citam regras, Rent intacto.

## Ciclo 2 — APPROVE (após `ed04769`)
🔴 resolvido: App.test.tsx mocka `./api/tags` + `await act` → warning act sumiu. Reset selectedTagIds ao abrir edição; comentário deps. Suíte 25/25, tsc 0.
1 🟡 novo não-bloqueante: `saveTagEdit` sem try/catch (UX/robustez).

**Merge:** `ff12327` (--no-ff).

<!-- VERDICT: APPROVE -->
