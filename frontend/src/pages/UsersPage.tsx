import { FormEvent, useState } from 'react';
import { createUser, listUsers } from '../api/users';
import { useAsync } from '../hooks/useAsync';
import { AsyncBoundary } from '../components/AsyncBoundary';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import p from '../styles/page.module.css';

export function UsersPage() {
  const { data, loading, error, reload } = useAsync(listUsers, []);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createUser(name.trim());
      setName('');
      await reload();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={p.section}>
      <h2 className={p.heading}>Users</h2>

      <form className={p.inlineForm} onSubmit={onSubmit}>
        <Input
          className={p.grow}
          aria-label="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="submit" disabled={submitting || name.trim().length < 2}>
          Create user
        </Button>
      </form>

      <AsyncBoundary loading={loading} error={error} onRetry={reload}>
        {data && data.length > 0 ? (
          <ul className={p.list}>
            {data.map((u) => (
              <li key={u.id} className={p.row}>
                <span className={p.rowMain}>{u.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={p.empty}>No users yet. Create the first one above.</p>
        )}
      </AsyncBoundary>
    </section>
  );
}
