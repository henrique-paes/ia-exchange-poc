# Spec: Rental

Links a user to a book they have rented. The core domain.

## Fields

| Field | Type | Rules |
|-------|------|-------|
| `id` | string (uuid) | server-generated |
| `userId` | string (uuid) | required; existing user |
| `bookId` | string (uuid) | required; existing book |
| `rentedAt` | datetime | server-generated |
| `returnedAt` | datetime \| null | null while active; set on return |

A rental is **active** when `returnedAt is null`.

## Rules

- `rental.user.exists` — `userId` must reference an existing user, else not-found.
- `rental.book.exists` — `bookId` must reference an existing book, else not-found.
- `rental.availability` — a book can only be rented when `available = true`.
  Renting an unavailable book is a conflict (409).
- `rental.rent.effect` — on rent: create an active rental and set the book
  `available = false`.
- `rental.limit` — a user may hold at most **3** active rentals at once.
  Exceeding it is a conflict (409).
- `rental.return.effect` — on return: set `returnedAt = now` and the book
  `available = true`.
- `rental.return.active` — only an active rental can be returned; returning an
  already-returned (or unknown) rental is a conflict/not-found.

## Behavior

- `rental.rent` — input `{ userId, bookId }`. Enforces existence, availability,
  and the per-user limit. Returns the created rental.
- `rental.return` — input `{ rentalId }`. Returns the updated rental.
- `rental.listByUser` — returns all rentals (active + returned) for a user.

## Constants

- `MAX_ACTIVE_RENTALS_PER_USER = 3`
