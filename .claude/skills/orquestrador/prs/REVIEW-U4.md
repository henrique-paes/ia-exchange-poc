# REVIEW-U4 — ciclo 1

**Branch:** `feat/tag-u4-bookrel` · **Veredito:** REQUEST CHANGES (sem crítico, 4 🟡) · Suíte 50/50

## 🟡 Sugestões
1. `book.controller.ts:18` — `tagIds = raw as string[]` confia no qs do Express; `?tagIds[a]=b` pode injetar não-string fora da validação. Coagir/validar com `z.array(z.string().uuid())` ou filtrar `typeof === 'string'`.
2. `book.service.ts:51-53` — `update` = 3 round-trips sem transação; TOCTOU teórico (tag deletada entre validação e set). Envolver em `$transaction` quando delete de tag existir.
3. `book.repository.ts:33-42` — filtro AND gera N subconsultas `some`; documentar/cap cardinalidade de tagIds.
4. `book.service.test.ts:240` — `require(...)` no meio do arquivo; usar `import` no topo.

## 🟢 Positivos
DI de TagRepository (DIP); `validateAndDeduplicateTags` DRY; `BookWithTags` explícito; testes garantem "nada escrito" (`repo.create not called`).

## Ciclo 2 — APPROVE (após `4856539`)
4 achados resolvidos: query tagIds validado c/ Zod (inválido→400, válido-desconhecido→200 sem casar, ausente→todos); TOCTOU/cardinalidade documentados; require→import. Suíte 52/52 (+2 integração filtro). rental sem regressão.
1 🟡 novo não-bloqueante: comentário no controller desalinhado (não-string vira "sem filtro", não 400).
**Nota orquestração:** U4 já adicionou 2 testes de filtro em `tests/integration/api.test.ts` — U5 deve evitar duplicar.

**Merge:** `84d4f47` (--no-ff).

<!-- VERDICT: APPROVE -->
