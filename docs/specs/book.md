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
| `tags` | Tag[] | 0..N tags associadas; lido como objetos hidratados `{ id, name, createdAt }` |

> A relação many-to-many com tags é especificada em [`tag.md`](./tag.md).

## Validation rules

- `book.title.required` — title present, non-empty after trim (create; optional on update).
- `book.author.required` — author present, non-empty after trim (create; optional on update).
- `book.creator.exists` — `creatorId` must reference an existing user, else not-found.
- `book.update.noFields` — a PATCH request with no recognized fields in the body is a validation error (400).
- `book.tags.optional` — `tagIds` is optional on create and update. See [`tag.md`](./tag.md) for full rules.
- `book.tags.exists` — every `tagId` in `tagIds` must reference an existing tag, else not-found (404).

## Behavior

- `book.create` — any existing user can create a book from `{ title, author, creatorId, tagIds? }`.
  New books start `available = true`. If `tagIds` is provided, validates all ids exist before
  creating the book and its tag links atomically (see `book.tags.exists`).
- `book.update` — `PATCH /books/:id` accepts a partial body `{ title?, author?, tagIds? }`.
  Only supplied fields are updated. `tagIds` when present replaces the full tag set
  (set semantics: `[]` clears all tags, omitted leaves tags unchanged). Returns the updated book
  with its current `tags: Tag[]`. Requires at least one field.
- `book.list` — returns all books, each including `tags: Tag[]`. Accepts optional repeated
  query param `tagIds` (`?tagIds=<uuid>&tagIds=<uuid>`) for AND/match-all filtering; books
  that have **all** specified tags are returned. Unknown tag ids simply match no book.
- `book.getById` — returns the book (including `tags: Tag[]`) or a not-found error.

## Notes

- `available` is never set directly by the client; it is managed by the rental flow.
- Tag-related rules (uniqueness, existence, set semantics) are fully specified in
  [`tag.md`](./tag.md) under the "Book ⇄ Tags" section.
