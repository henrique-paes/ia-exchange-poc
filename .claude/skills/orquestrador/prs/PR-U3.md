# PR-U3 — feat(tags): Tag module backend (T3-T7)

- **Branch:** `feat/tag-u3-tagmodule` ← `feat/agents-poc`
- **Commit:** `7a7e34c feat(tags): add Tag module backend — schema, repo, service, controller, routes (T3-T7)`
- **Tarefa:** T3-T7 · **Camada:** backend (schema/repo/service/controller/routes)

## Arquivos
- `backend/src/modules/tags/{tag.schema,tag.repository,tag.service,tag.controller,tag.routes}.ts` (novos)
- `backend/src/routes.ts` (+import +`apiRouter.use('/tags', tagRoutes)`)
- `backend/tests/tag.service.test.ts` (novo — TDD red-first)

## Cobertura de regras
- `tag.name.required`/`length` (zod trim 1-40) · `tag.name.unique` (findByNameInsensitive → ConflictError 409, "Sci-Fi"≡"sci-fi") · `tag.list` (orderBy name asc) · `tag.getById`/`exists` (NotFoundError 404).
- `ConflictError`/`conflict` já existiam em AppError + errorHandler — sem alteração.

## Testes
`docker compose exec -T backend npm test` → **28/28** (6 novos de tag + 22 prévios). Logs `event:'tag.create'` sem PII.

## Critério de aceite
Atendido: endpoints 201/200/404/409/400; suíte verde.
