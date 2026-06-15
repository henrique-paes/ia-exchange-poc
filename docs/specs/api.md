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
- `POST /books` — body `{ title, author, creatorId }` → `201 Book` | `400` | `404`
- `GET /books` → `200 Book[]`
- `GET /books/:id` → `200 Book` | `404`

### Rentals
- `POST /rentals` — body `{ userId, bookId }` → `201 Rental` | `400` | `404` | `409`
- `POST /rentals/:id/return` → `200 Rental` | `404` | `409`

## Resource shapes

```ts
User   = { id, name, createdAt }
Book   = { id, title, author, available, creatorId, createdAt }
Rental = { id, userId, bookId, rentedAt, returnedAt }
```
