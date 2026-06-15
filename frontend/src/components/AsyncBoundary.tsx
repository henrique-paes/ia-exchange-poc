import { ReactNode } from 'react';

// Standard loading / error rendering so every page handles both states the
// same way (CARD-034).
export function AsyncBoundary({
  loading,
  error,
  children,
}: {
  loading: boolean;
  error: string | null;
  children: ReactNode;
}) {
  if (loading) return <p role="status">Loading…</p>;
  if (error) return <p role="alert">Error: {error}</p>;
  return <>{children}</>;
}
