# PRs & Revisões simuladas — spec `tag.md`

Modo **local** (Política de Dados Shopper: remote `henrique-paes` não é `shopperti`,
push/PR remoto bloqueado). Pipeline roda 100% local; PRs e revisões ficam aqui como
artefatos `.md` para visibilidade.

- `PR-<U>.md` — descrição do "PR" (título, branch, arquivos, commits, testes) gerada
  pelo Programador da unidade.
- `REVIEW-<U>.md` — veredito do Revisor (🔴/🟡/🟢 + `VERDICT`).

Base de todas as branches: `feat/agents-poc` (contém o spec). Merge local `--no-ff`
após `APPROVE`.

Mapa unidade → tarefas do plano (T1–T26):

| Unidade | Tarefas | Camada |
|---------|---------|--------|
| U1 | T14 | specs api.md + book.md |
| U2 | T1, T2 | Prisma model + migration + test helper |
| U7 | T16 | spec ui-tags.md |
| U8 | T17 | frontend types |
| U3 | T3–T7 | módulo Tag backend |
| U6 | T15 | seed + TASKS.md |
| U4 | T8–T12 | relação Book⇄Tags backend |
| U9 | T18–T21 | frontend Tags page + API + nav |
| U5 | T13 | testes integração |
| U10 | T22–T26 | frontend Books tags + filtro |
