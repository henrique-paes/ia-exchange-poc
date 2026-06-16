import { FormEvent, useState } from 'react';
import { Book, User } from '../api/types';
import { createBook, listBooks } from '../api/books';
import { listUsers } from '../api/users';
import { rentBook } from '../api/rentals';
import { useAsync } from '../hooks/useAsync';
import { AsyncBoundary } from '../components/AsyncBoundary';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { StatusPill } from '../components/ui/StatusPill';
import p from '../styles/page.module.css';

function UserOptions({ users }: { users: User[] }) {
  return (
    <>
      {users.map((u) => (
        <option key={u.id} value={u.id}>
          {u.name}
        </option>
      ))}
    </>
  );
}

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
    <form className={p.inlineForm} onSubmit={onSubmit}>
      <Input className={p.grow} aria-label="title" placeholder="Title" value={form.title} onChange={set('title')} />
      <Input className={p.grow} aria-label="author" placeholder="Author" value={form.author} onChange={set('author')} />
      <Select aria-label="creator" value={form.creatorId} onChange={set('creatorId')}>
        <option value="">Creator…</option>
        <UserOptions users={users} />
      </Select>
      <Button type="submit" disabled={!valid}>
        Create book
      </Button>
    </form>
  );
}

function BookRow({ book, canRent, onRent }: { book: Book; canRent: boolean; onRent: () => void }) {
  return (
    <li className={p.row}>
      <span className={p.rowMain}>
        <strong>{book.title}</strong>
        <span className={p.rowMeta}>{book.author}</span>
      </span>
      <span className={p.rowActions}>
        <StatusPill tone={book.available ? 'success' : 'warning'}>
          {book.available ? 'available' : 'rented'}
        </StatusPill>
        <Button onClick={onRent} disabled={!book.available || !canRent}>
          Rent
        </Button>
      </span>
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
    <section className={p.section}>
      <h2 className={p.heading}>Books</h2>
      <CreateBookForm users={users.data ?? []} onCreated={books.reload} />

      <label className={p.toolbar}>
        Rent as:
        <Select aria-label="rent as" value={actorId} onChange={(e) => setActorId(e.target.value)}>
          <option value="">Select user…</option>
          <UserOptions users={users.data ?? []} />
        </Select>
      </label>

      <AsyncBoundary loading={books.loading} error={books.error} onRetry={books.reload}>
        {books.data && books.data.length > 0 ? (
          <ul className={p.list}>
            {books.data.map((b) => (
              <BookRow key={b.id} book={b} canRent={!!actorId} onRent={() => rent(b.id)} />
            ))}
          </ul>
        ) : (
          <p className={p.empty}>No books yet. Add one above.</p>
        )}
      </AsyncBoundary>
    </section>
  );
}
