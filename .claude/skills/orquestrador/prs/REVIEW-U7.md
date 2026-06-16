# REVIEW-U7 — ciclo 1

**Branch:** `feat/tag-u7-uispec` · **Veredito:** REQUEST CHANGES (1 🔴, 2 🟡)

## 🔴 Crítico
- `ui-tags.md:171` — traça convenção de params repetidos para `tag-book-relation-decisions.md`, **arquivo inexistente** (referência quebrada, viola SDD). Apontar para `tag.md §"Filtering books by tags"` (`book.filterByTags`) e/ou `api.md` (GET /books).

## 🟡 Sugestões
- `ui-tags.md:29,36` — contradição: `maxlength="40"` (conta antes do trim) torna a cláusula "desabilitar se trim > 40" código morto e diverge de `tag.md:18` (length = trimmed). Escolher estratégia única.
- `ui-tags.md:89` — dedupe do seletor sem critério; explicitar dedupe por `tag.id` (não por nome, já que unicidade de nome é case-insensitive no service).

## 🟢 Positivos
- Tabela de aria-labels + foco/hit target testável.
- Distinção omitir≡inalterado vs `[]`≡limpar (PATCH set-semantics) correta.

## Ciclo 2 (re-revisão após `02cea16`)
3 achados resolvidos e coerentes com tag.md. Sem crítico. 1 🟡 cosmético (frase mistura dedupe UI×payload), não bloqueia.

**Merge:** `17188af` (--no-ff).

<!-- VERDICT: APPROVE -->
