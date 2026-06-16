# PR-U6 — chore(seed): example tags + link to books; track CARD-026 (T15)

- **Branch:** `feat/tag-u6-seed` ← `feat/agents-poc`
- **Commit:** `7ba15b9 chore(seed): add example tags + link to books; track CARD-026 (T15)`
- **Tarefa:** T15 · **Camada:** backend/db + docs

## Arquivos
- `backend/prisma/seed.ts` — reescrito: limpeza FK-safe (rentals→books→tags→users); 4 tags; 5 books com `tags: { connect }`.
- `TASKS.md` — Phase 6 / CARD-026 (spec/model/módulo/seed marcados; relação book/filtro/UI desmarcados — fiel ao estado).

## Verificação
`npm run seed` → `2 users, 4 tags, 5 books with tags`. `_BookToTag` = 8 vínculos confirmados no banco.

## Atenção (revisar)
- Seed foi **reescrito** (não só additivo) — revisar fidelidade ao comportamento anterior (users/books originais preservados).

## Critério de aceite
Atendido: seed roda sem erro com tags vinculadas; TASKS.md reflete card.
