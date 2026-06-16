# Spec: Tag

A label that categorizes books. A book can have **N** tags; a tag can be applied
to **N** books (many-to-many). Tags exist independently of books and are linked
to books at book create or edit time.

## Fields

| Field | Type | Rules |
|-------|------|-------|
| `id` | string (uuid) | server-generated |
| `name` | string | required, trimmed, 1–40 chars; unique (case-insensitive) |
| `createdAt` | datetime | server-generated |

## Validation rules

- `tag.name.required` — name present, non-empty after trim.
- `tag.name.length` — trimmed name is 1–40 chars.
- `tag.name.unique` — no two tags share the same name compared case-insensitively
  (`"Sci-Fi"` and `"sci-fi"` collide). Creating a duplicate is a conflict (409).
- `tag.exists` — any `tagId` referenced by a book must reference an existing tag,
  else not-found (404).

## Behavior

- `tag.create` — input `{ name }`. Trims and validates. Returns the created tag.
- `tag.list` — returns all tags, ordered by `name` ascending.
- `tag.getById` — returns the tag or a not-found error.

## Notes

- Names are stored as entered (trimmed) but compared case-insensitively for
  uniqueness. The stored casing is preserved for display.
- A tag is never auto-created by the book flow; a tag must exist before being
  linked to a book (see `book.tags.exists`).

---

# Spec: Book ⇄ Tags (relation)

Extends [`book.md`](./book.md). Tags are linked to a book on create or edit; the
relation is the join between an existing book and existing tags.

## Book fields (added)

| Field | Type | Rules |
|-------|------|-------|
| `tags` | Tag[] | 0..N; each entry references an existing tag |

The book create/edit payload carries `tagIds: string[]` (0..N uuid). The book
read shape returns the hydrated `tags: Tag[]`.

## Rules

- `book.tags.optional` — `tagIds` is optional. Omitted or `[]` means the book has
  no tags. Creating a book with 0 tags is valid.
- `book.tags.exists` — every id in `tagIds` must reference an existing tag, else
  not-found (404). The link is all-or-nothing: if any id is unknown the whole
  operation fails and no links are written.
- `book.tags.unique` — duplicate ids within one `tagIds` payload are deduplicated;
  a book is linked to a given tag at most once.
- `book.tags.set` — on edit, `tagIds` **replaces** the full set of links for the
  book (not an append). Sending `[]` clears all tags. Omitting `tagIds` on edit
  leaves the existing links unchanged.

## Behavior

- `book.create` (extended) — input `{ title, author, creatorId, tagIds? }`.
  Validates tag existence, then creates the book and its tag links atomically.
- `book.update` (extended) — input may include `tagIds`. When present, replaces
  the book's tag set per `book.tags.set`.
- `book.list` / `book.getById` (extended) — each returned book includes its
  `tags: Tag[]`.

## Filtering books by tags

- `book.filterByTags` — `book.list` accepts an optional `tagIds` filter (0..N).
  - No filter / empty → returns all books.
  - With filter → returns books that have **all** of the given tags (AND / match-all).
  - Unknown filter ids do not error; they simply match no book.
  - Each returned book still includes its full `tags: Tag[]`, not only the
    filtered subset.

## Notes

- Deleting a tag (if/when supported) must also remove its book links; a book
  never references a non-existent tag.
- The join carries no extra attributes — it is a pure many-to-many link.
