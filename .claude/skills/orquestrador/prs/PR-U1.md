# PR-U1 — docs(spec): add tag endpoints + book patch/filter (T14)

- **Branch:** `feat/tag-u1-specs` ← `feat/agents-poc`
- **Commit:** `a6a29e4 docs(spec): add tag endpoints + book patch/filter (T14)`
- **Tarefa:** T14 · **Camada:** specs · **Modo:** local (sem push/PR remoto)

## Arquivos
```
 docs/specs/api.md  | 25 +++++---
 docs/specs/book.md | 27 +++++++---
```

## Mudanças
- `api.md`: endpoints `POST /tags`, `GET /tags`, `GET /tags/:id`; `PATCH /books/:id`
  (update parcial); `GET /books?tagIds=` (params repetidos, AND/match-all); shape
  `Tag = { id, name, createdAt }`; `Book` com `tags: Tag[]`; tabela de erros (409 nome
  duplicado, 404 tag inexistente).
- `book.md`: campo `tags`; regras `book.update.noFields`, `book.tags.optional`,
  `book.tags.exists`; comportamentos `book.update`/`list`/`getById` reescritos.

## Testes
N/A (somente documentação).

## Critério de aceite
Atendido — specs cobrem todos os endpoints de tag, PATCH parcial, filtro match-all,
shapes e erros; `book.md` referencia `tag.md` e descreve `book.update`.
