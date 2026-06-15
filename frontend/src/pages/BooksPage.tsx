import { FormEvent, useState } from 'react';
import { Book, User } from '../api/types';
import { createBook, listBooks } from '../api/books';
import { listUsers } from '../api/users';
import { rentBook } from '../api/rentals';
import { useAsync } from '../hooks/useAsync';
import { AsyncBoundary } from '../components/AsyncBoundary';

function CreateBookForm({ users, onCreated }: { users: User[]; onCreated: () => void }) {
  const [form, setForm] = useState({ title: '', author: '', creatorId: '' });
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await createBook({ ...form, title: form.title.trim(), author: form.author.trim() });
    setForm({ title: '', author: '', creatorId: '' });
    onCreated();
  }

  const valid = form.title.trim() && form.author.trim() && form.creatorId;
  return (
    <form onSubmit={onSubmit}>
      <input aria-label="title" placeholder="Title" value={form.title} onChange={set('title')} />
      <input aria-label="author" placeholder="Author" value={form.author} onChange={set('author')} />
      <select aria-label="creator" value={form.creatorId} onChange={set('creatorId')}>
        <option value="">Creator…</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>
      <button type="submit" disabled={!valid}>
        Create book
      </button>
    </form>
  );
}

function BookRow({ book, canRent, onRent }: { book: Book; canRent: boolean; onRent: () => void }) {
  return (
    <li>
      {book.title} — {book.author} {book.available ? '(available)' : '(rented)'}
      <button onClick={onRent} disabled={!book.available || !canRent}>
        Rent
      </button>
    </li>
  );
}

export function BooksPage() {
  const books = useAsync(listBooks, []);
  const users = useAsync(listUsers, []);
  const [actorId, setActorId] = useState('');

  async function rent(bookId: string) {
    await rentBook(actorId, bookId);
    await books.reload();
  }

  return (
    <section>
      <h2>Books</h2>
      <CreateBookForm users={users.data ?? []} onCreated={books.reload} />

      <label>
        Rent as:{' '}
        <select aria-label="rent as" value={actorId} onChange={(e) => setActorId(e.target.value)}>
          <option value="">Select user…</option>
          {(users.data ?? []).map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </label>

      <AsyncBoundary loading={books.loading} error={books.error}>
        <ul>
          {books.data?.map((b) => (
            <BookRow key={b.id} book={b} canRent={!!actorId} onRent={() => rent(b.id)} />
          ))}
        </ul>
      </AsyncBoundary>
    </section>
  );
}
