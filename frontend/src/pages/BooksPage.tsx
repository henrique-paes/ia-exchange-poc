import { FormEvent, useState } from 'react';
import { Book, Tag, User } from '../api/types';
import { createBook, listBooks, updateBook } from '../api/books';
import { listTags } from '../api/tags';
import { listUsers } from '../api/users';
import { rentBook } from '../api/rentals';
import { useAsync } from '../hooks/useAsync';
import { AsyncBoundary } from '../components/AsyncBoundary';
import { TagPicker } from '../components/TagPicker';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { StatusPill } from '../components/ui/StatusPill';
import p from '../styles/page.module.css';
import s from './BooksPage.module.css';

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

function CreateBookForm({
  users,
  allTags,
  onCreated,
}: {
  users: User[];
  allTags: Tag[];
  onCreated: () => void;
}) {
  const [form, setForm] = useState({ title: '', author: '', creatorId: '' });
  const [tagIds, setTagIds] = useState<string[]>([]);
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await createBook({
      ...form,
      title: form.title.trim(),
      author: form.author.trim(),
      tagIds,
    });
    setForm({ title: '', author: '', creatorId: '' });
    setTagIds([]);
    onCreated();
  }

  const valid = form.title.trim() && form.author.trim() && form.creatorId;
  return (
    <form className={p.inlineForm} onSubmit={onSubmit}>
      <Input
        className={p.grow}
        aria-label="title"
        placeholder="Title"
        value={form.title}
        onChange={set('title')}
      />
      <Input
        className={p.grow}
        aria-label="author"
        placeholder="Author"
        value={form.author}
        onChange={set('author')}
      />
      <Select aria-label="creator" value={form.creatorId} onChange={set('creatorId')}>
        <option value="">Creator…</option>
        <UserOptions users={users} />
      </Select>
      <TagPicker
        tags={allTags}
        value={tagIds}
        onChange={setTagIds}
        label="Tags"
        ariaLabel="book tags"
      />
      <Button type="submit" disabled={!valid}>
        Create book
      </Button>
    </form>
  );
}

function TagPills({ tags }: { tags: Tag[] }) {
  if (tags.length === 0) return null;
  return (
    <span className={s.tagPills} aria-label="book tags">
      {tags.map((t) => (
        <span key={t.id} className={s.tagPill}>
          {t.name}
        </span>
      ))}
    </span>
  );
}

function BookRow({
  book,
  canRent,
  onRent,
  allTags,
  onTagsUpdated,
}: {
  book: Book;
  canRent: boolean;
  onRent: () => void;
  allTags: Tag[];
  onTagsUpdated: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(book.tags.map((t) => t.id));

  async function saveTagEdit() {
    await updateBook(book.id, { tagIds: selectedTagIds });
    setEditing(false);
    onTagsUpdated();
  }

  return (
    <li className={p.row}>
      <span className={p.rowMain}>
        <strong>{book.title}</strong>
        <span className={p.rowMeta}>{book.author}</span>
        <TagPills tags={book.tags} />
      </span>
      <span className={p.rowActions}>
        {editing ? (
          <>
            <TagPicker
              tags={allTags}
              value={selectedTagIds}
              onChange={setSelectedTagIds}
              ariaLabel="book tags"
            />
            <Button onClick={saveTagEdit}>Save tags</Button>
            <Button variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <StatusPill tone={book.available ? 'success' : 'warning'}>
              {book.available ? 'available' : 'rented'}
            </StatusPill>
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedTagIds(book.tags.map((t) => t.id));
                setEditing(true);
              }}
            >
              Edit tags
            </Button>
            <Button onClick={onRent} disabled={!book.available || !canRent}>
              Rent
            </Button>
          </>
        )}
      </span>
    </li>
  );
}

export function BooksPage() {
  const [filterTagIds, setFilterTagIds] = useState<string[]>([]);
  // deps: join serializa o array em string para estabilizar a identidade da dep (array novo a cada render seria sempre diferente)
  const books = useAsync(() => listBooks(filterTagIds.length ? filterTagIds : undefined), [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    filterTagIds.join(','),
  ]);
  const users = useAsync(listUsers, []);
  const tags = useAsync(listTags, []);
  const [actorId, setActorId] = useState('');

  async function rent(bookId: string) {
    await rentBook(actorId, bookId);
    await books.reload();
  }

  return (
    <section className={p.section}>
      <h2 className={p.heading}>Books</h2>
      <CreateBookForm
        users={users.data ?? []}
        allTags={tags.data ?? []}
        onCreated={books.reload}
      />

      <div className={p.toolbar}>
        <label>
          Rent as:
          <Select aria-label="rent as" value={actorId} onChange={(e) => setActorId(e.target.value)}>
            <option value="">Select user…</option>
            <UserOptions users={users.data ?? []} />
          </Select>
        </label>

        <TagPicker
          tags={tags.data ?? []}
          value={filterTagIds}
          onChange={setFilterTagIds}
          label="Filter by tags"
          ariaLabel="filter by tags"
        />
      </div>

      <AsyncBoundary loading={books.loading} error={books.error} onRetry={books.reload}>
        {books.data && books.data.length > 0 ? (
          <ul className={p.list}>
            {books.data.map((b) => (
              <BookRow
                key={b.id}
                book={b}
                canRent={!!actorId}
                onRent={() => rent(b.id)}
                allTags={tags.data ?? []}
                onTagsUpdated={books.reload}
              />
            ))}
          </ul>
        ) : (
          <p className={p.empty}>No books yet. Add one above.</p>
        )}
      </AsyncBoundary>
    </section>
  );
}
