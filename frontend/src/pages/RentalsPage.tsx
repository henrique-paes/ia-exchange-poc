import { useState } from 'react';
import { Book } from '../api/types';
import { listUsers, listUserRentals } from '../api/users';
import { listBooks } from '../api/books';
import { returnRental } from '../api/rentals';
import { useAsync } from '../hooks/useAsync';
import { AsyncBoundary } from '../components/AsyncBoundary';

const titleOf = (books: Book[], bookId: string) =>
  books.find((b) => b.id === bookId)?.title ?? bookId;

export function RentalsPage() {
  const users = useAsync(listUsers, []);
  const books = useAsync(listBooks, []);
  const [userId, setUserId] = useState('');
  const rentals = useAsync(
    () => (userId ? listUserRentals(userId) : Promise.resolve([])),
    [userId],
  );

  async function doReturn(rentalId: string) {
    await returnRental(rentalId);
    await Promise.all([rentals.reload(), books.reload()]);
  }

  return (
    <section>
      <h2>Rentals</h2>
      <label>
        User:{' '}
        <select aria-label="user" value={userId} onChange={(e) => setUserId(e.target.value)}>
          <option value="">Select user…</option>
          {(users.data ?? []).map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </label>

      <AsyncBoundary loading={rentals.loading} error={rentals.error}>
        <ul>
          {rentals.data?.map((r) => (
            <li key={r.id}>
              {titleOf(books.data ?? [], r.bookId)} —{' '}
              {r.returnedAt ? 'returned' : 'active'}
              {!r.returnedAt && <button onClick={() => doReturn(r.id)}>Return</button>}
            </li>
          ))}
        </ul>
      </AsyncBoundary>
    </section>
  );
}
