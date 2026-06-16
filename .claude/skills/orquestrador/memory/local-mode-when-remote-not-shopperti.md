---
name: local-mode-when-remote-not-shopperti
description: Quando o remote git não é do domínio shopperti, rodar pipeline em modo local (sem push/PR) e simular PRs/revisões como .md
metadata:
  type: project
---

A Política de Dados da Shopper só permite GitHub no domínio `shopperti`. Se o
`origin` apontar para conta/org diferente (ex.: `henrique-paes`), **não** dar push
nem abrir PR — viola a política, independente de máquina/dono.

**Modo local** (fallback aprovado): cada Programador cria branch a partir da base,
implementa, testa, commita **local** (sem push, sem `gh`); o orquestrador faz
`git merge --no-ff` local após APPROVE. PRs e revisões viram artefatos `.md` em
`.claude/skills/orquestrador/prs/` (`PR-<U>.md`, `REVIEW-<U>.md`) para visibilidade.

**Base branch:** verificar antes — neste repo a spec/agents vivem em `feat/agents-poc`,
não em `main`; branchar de `main` deixaria os Programadores sem o spec.

**Execução serial:** em modo local há uma só working tree; rodar unidades em
série (não paralelo) evita colisão de git/checkout e reaproveita node_modules do
container docker (testes via `docker compose exec -T backend|frontend`).

**Colisão de teste de integração:** uma unidade que adiciona testes em
`tests/integration/api.test.ts` (ex.: filtro) deve avisar a unidade de testes e2e
seguinte para não duplicar.
