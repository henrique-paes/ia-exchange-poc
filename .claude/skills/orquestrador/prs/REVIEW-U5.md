# REVIEW-U5 — ciclo 1

**Branch:** `feat/tag-u5-integ` · **Veredito:** APPROVE (sem crítico, 4 🟡 robustez) · Suíte 62/62

## 🟡 (não bloqueiam — carryover opcional)
- `api.test.ts:248` — PATCH "preserva ao omitir" carrega `title`; adicionar PATCH puro (sem tagIds) p/ isolar.
- `api.test.ts:271` — filtro com muitas asserções num `it`; dividir match-all vs hidratação.
- `tag.name.length` — falta caso de fronteira válido (1 e 40 chars → 201).
- dedup `book.tags.unique` — complementar com GET /books/:id (persistência).

## 🟢
- Não-persistência de `book.tags.exists` via GET (all-or-nothing real); case-insensitive Sci-Fi/sci-fi; 3 ramos de set; isolamento resetDb; sem PII; não duplica U4.

**Merge:** `4be5ea9` (--no-ff).

<!-- VERDICT: APPROVE -->
