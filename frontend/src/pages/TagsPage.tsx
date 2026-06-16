import { FormEvent, useState } from 'react';
import { AxiosError } from 'axios';
import { createTag, listTags } from '../api/tags';
import { Tag } from '../api/types';
import { useAsync } from '../hooks/useAsync';
import { AsyncBoundary } from '../components/AsyncBoundary';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Field } from '../components/ui/Field';
import p from '../styles/page.module.css';

function toApiMessage(err: unknown): string {
  const axiosErr = err as AxiosError<{ error?: { message?: string } }>;
  return (
    axiosErr?.response?.data?.error?.message ??
    (err as Error)?.message ??
    'unexpected error'
  );
}

function TagItem({ tag }: { tag: Tag }) {
  return (
    <li className={p.row}>
      <span className={p.rowMain}>
        <span>{tag.name}</span>
        <span className={p.rowMeta}>{new Date(tag.createdAt).toLocaleDateString()}</span>
      </span>
    </li>
  );
}

export function TagsPage() {
  const { data, loading, error, reload } = useAsync(listTags, []);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const trimmed = name.trim();
  const isValid = trimmed.length >= 1 && trimmed.length <= 40;
  const isDisabled = !isValid || submitting;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setCreateError(null);
    setSubmitting(true);
    try {
      await createTag(trimmed);
      setName('');
      await reload();
    } catch (err) {
      setCreateError(toApiMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={p.section}>
      <h2 className={p.heading}>Tags</h2>

      <form className={p.inlineForm} onSubmit={onSubmit}>
        <Field label="Tag name" htmlFor="tag-name-input" error={createError ?? undefined}>
          <Input
            id="tag-name-input"
            aria-label="tag name"
            placeholder="e.g. Sci-Fi"
            value={name}
            invalid={!!createError}
            onChange={(e) => {
              setName(e.target.value);
              setCreateError(null);
            }}
          />
        </Field>
        <Button type="submit" disabled={isDisabled}>
          Create tag
        </Button>
      </form>

      <AsyncBoundary loading={loading} error={error} onRetry={reload}>
        {data && data.length > 0 ? (
          <ul className={p.list}>
            {data.map((t) => (
              <TagItem key={t.id} tag={t} />
            ))}
          </ul>
        ) : (
          <p className={p.empty}>No tags yet. Create your first tag above.</p>
        )}
      </AsyncBoundary>
    </section>
  );
}
