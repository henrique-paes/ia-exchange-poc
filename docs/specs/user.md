# Spec: User

A person who can create books and rent books.

## Fields

| Field | Type | Rules |
|-------|------|-------|
| `id` | string (uuid) | server-generated |
| `name` | string | required, trimmed, 2–100 chars |
| `createdAt` | datetime | server-generated |

## Validation rules

- `user.name.required` — name must be present and non-empty after trim.
- `user.name.length` — trimmed length between 2 and 100 chars.

## Behavior

- `user.create` — creates a user from `{ name }`. Returns the created user.
- `user.getById` — returns the user or a not-found error.

## Notes

- No email/phone/CPF are stored (data policy: no PII).
