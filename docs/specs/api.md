# Spec: API Contract

REST/JSON over HTTP. Base URL = backend host (`:3001` in dev).
All request and response bodies are JSON.

## Conventions

- IDs are uuid strings.
- Timestamps are ISO 8601 strings.
- Errors share one shape:

  ```json
  { "error": { "code": "string", "message": "string", "details": [] } }
  ```

- Error `code` is one of: `validation_error`, `not_found`, `conflict`.

## Status codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Validation error (`validation_error`) |
| 404 | Resource not found (`not_found`) |
| 409 | Rule conflict, e.g. unavailable book or rental limit (`conflict`) |

## Endpoints

### Health
- `GET /health` → `200 { "status": "ok" }`

### Users
- `POST /users` — body `{ name }` → `201 User`
- `GET /users` → `200 User[]`
- `GET /users/:id` → `200 User` | `404`
- `GET /users/:id/rentals` → `200 Rental[]` | `404`

### Books
- `POST /books` — body `{ title, author, creatorId, tagIds?: string[] }` → `201 Book` | `400` | `404`
- `GET /books` — query params repetidos: `?tagIds=<uuid>&tagIds=<uuid>` (match-all AND; omitir retorna todos) → `200 Book[]`
  - Ids de filtro não são validados estritamente: um id desconhecido ou sintaticamente
    inválido (não-uuid) simplesmente não casa nenhum book — retorna vazio, **sem** erro 400.
    (Ver `tag.md` §"Unknown filter ids do not error".)
- `GET /books/:id` → `200 Book` | `404`
- `PATCH /books/:id` — body parcial `{ title?: string, author?: string, tagIds?: string[] }` → `200 Book` | `400` | `404`
  - Campos omitidos permanecem inalterados.
  - `tagIds` omitido não altera as tags existentes; `tagIds: []` limpa todas as tags.
  - Pelo menos um campo deve ser fornecido.

### Tags
- `POST /tags` — body `{ name }` → `201 Tag` | `400` | `409`
  - 409 quando já existe tag com o mesmo nome (case-insensitive).
- `GET /tags` → `200 Tag[]` (ordenado por `name` asc)
- `GET /tags/:id` → `200 Tag` | `404`

### Rentals
- `POST /rentals` — body `{ userId, bookId }` → `201 Rental` | `400` | `404` | `409`
- `POST /rentals/:id/return` → `200 Rental` | `404` | `409`

## Resource shapes

```ts
User   = { id, name, createdAt }
Tag    = { id, name, createdAt }
Book   = { id, title, author, available, creatorId, createdAt, tags: Tag[] }
Rental = { id, userId, bookId, rentedAt, returnedAt }
```

### Notas de erro por endpoint

| Situação | Status | `code` |
|----------|--------|--------|
| `tagIds` contém id de tag inexistente (create/update de book) | 404 | `not_found` |
| `POST /tags` com nome já existente (case-insensitive) | 409 | `conflict` |
| `PATCH /books/:id` sem campos no body | 400 | `validation_error` |
