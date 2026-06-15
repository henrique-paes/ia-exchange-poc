import { FormEvent, useState } from 'react';
import { createUser, listUsers } from '../api/users';
import { useAsync } from '../hooks/useAsync';
import { AsyncBoundary } from '../components/AsyncBoundary';

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
    <section>
      <h2>Users</h2>
      <form onSubmit={onSubmit}>
        <input
          aria-label="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" disabled={submitting || name.trim().length < 2}>
          Create user
        </button>
      </form>
      <AsyncBoundary loading={loading} error={error}>
        <ul>{data?.map((u) => <li key={u.id}>{u.name}</li>)}</ul>
      </AsyncBoundary>
    </section>
  );
}
