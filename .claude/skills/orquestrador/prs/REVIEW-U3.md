# REVIEW-U3 — ciclo 1

**Branch:** `feat/tag-u3-tagmodule` · **Veredito:** REQUEST CHANGES (sem crítico, 3 🟡)

## 🟡 Sugestões
1. `tag.repository.ts:18` — `findManyByIds` sem consumidor neste PR (será usado em U4/book.tags.exists). Marcar com comentário ou trazer junto do consumidor.
2. `tests/tag.service.test.ts` — `tag.name.length`/`required` exercidos só indireto. Adicionar teste de schema: `createTagSchema.parse` rejeita `""`, `"   "`, e 41 chars.
3. `tag.service.ts:11` — janela TOCTOU entre `findByNameInsensitive` e `create` (sem UNIQUE nativo). Aceitável p/ POC; documentar limitação.

## 🟢 Positivos
Fábrica c/ DI espelha book.service; uniqueness case-insensitive parametrizada; log boundary só `tagId` (sem PII); testes citam regras. Suíte 28/28.

## Ciclo 2 — APPROVE (após `e957318`)
3 achados resolvidos (comentário findManyByIds, testes schema required/length/trim, nota TOCTOU). Suíte 32/32.
1 🟡 novo não-bloqueante: `listTags`/`getTag` sem evento de boundary (só create tem). Carryover opcional.

**Merge:** `faa35e1` (--no-ff).

<!-- VERDICT: APPROVE -->
