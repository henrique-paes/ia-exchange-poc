import { useState } from 'react';
import { Book } from '../api/types';
import { listUsers, listUserRentals } from '../api/users';
import { listBooks } from '../api/books';
import { returnRental } from '../api/rentals';
import { useAsync } from '../hooks/useAsync';
import { AsyncBoundary } from '../components/AsyncBoundary';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { StatusPill } from '../components/ui/StatusPill';
import p from '../styles/page.module.css';

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
    <section className={p.section}>
      <h2 className={p.heading}>Rentals</h2>

      <label className={p.toolbar}>
        User:
        <Select aria-label="user" value={userId} onChange={(e) => setUserId(e.target.value)}>
          <option value="">Select user…</option>
          {(users.data ?? []).map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </Select>
      </label>

      <AsyncBoundary loading={rentals.loading} error={rentals.error} onRetry={rentals.reload}>
        {rentals.data && rentals.data.length > 0 ? (
          <ul className={p.list}>
            {rentals.data.map((r) => (
              <li key={r.id} className={p.row}>
                <span className={p.rowMain}>
                  <strong>{titleOf(books.data ?? [], r.bookId)}</strong>
                </span>
                <span className={p.rowActions}>
                  <StatusPill tone={r.returnedAt ? 'success' : 'warning'}>
                    {r.returnedAt ? 'returned' : 'active'}
                  </StatusPill>
                  {!r.returnedAt && <Button onClick={() => doReturn(r.id)}>Return</Button>}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={p.empty}>
            {userId ? 'No rentals for this user.' : 'Select a user to see their rentals.'}
          </p>
        )}
      </AsyncBoundary>
    </section>
  );
}
