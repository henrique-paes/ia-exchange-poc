# REVIEW-U2 — ciclo 1

**Branch:** `feat/tag-u2-prisma` · **Veredito:** APPROVE (sem crítico)

## 🟡 Sugestões (não bloqueiam)
- `@@index([name])` / índice funcional `lower(name)` futuro (list ordena por name; lookup case-insensitive no service).
- `name` sem `@db.VarChar(40)` — limite só no service (aceitável por SDD).

## 🟢 Positivos
- Junção `_BookToTag` com `ON DELETE CASCADE` nas 2 pontas → sem órfãos (spec Notes ✓).
- Sem `UNIQUE` em name (decisão deliberada ✓).
- Model Tag bate 1:1 com Fields da spec.
- `resetDb` ordem FK-safe (rentals→books→tags→users).
- Sem PII/segredos.

**Merge:** `d9e90b4` (--no-ff).

<!-- VERDICT: APPROVE -->
