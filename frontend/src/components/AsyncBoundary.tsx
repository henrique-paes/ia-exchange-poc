import { ReactNode } from 'react';
import { Spinner } from './ui/Spinner';
import { Button } from './ui/Button';
import s from './AsyncBoundary.module.css';

// Standard loading / error rendering so every page handles both states the
// same way (docs/specs/ui-components.md → Loading & Error states).
export function AsyncBoundary({
  loading,
  error,
  onRetry,
  children,
}: {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  children: ReactNode;
}) {
  if (loading) {
    return (
      <div className={s.status} role="status">
        <Spinner />
        <span>Loading…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={s.status} role="alert">
        <span className={s.error}>Error: {error}</span>
        {onRetry && (
          <Button variant="ghost" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
