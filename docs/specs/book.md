# Spec: Book

A book in the library, created by a user, rentable by users.

## Fields

| Field | Type | Rules |
|-------|------|-------|
| `id` | string (uuid) | server-generated |
| `title` | string | required, trimmed, 1–200 chars |
| `author` | string | required, trimmed, 1–120 chars |
| `available` | boolean | server-managed; `true` on create |
| `creatorId` | string (uuid) | required; must reference an existing user |
| `createdAt` | datetime | server-generated |

## Validation rules

- `book.title.required` — title present, non-empty after trim.
- `book.author.required` — author present, non-empty after trim.
- `book.creator.exists` — `creatorId` must reference an existing user, else not-found.

## Behavior

- `book.create` — any existing user can create a book from `{ title, author, creatorId }`.
  New books start `available = true`.
- `book.list` — returns all books.
- `book.getById` — returns the book or a not-found error.

## Notes

- `available` is never set directly by the client; it is managed by the rental flow.
