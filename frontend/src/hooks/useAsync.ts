import { DependencyList, useCallback, useEffect, useState } from 'react';
import { AxiosError } from 'axios';

// Extracts the API contract's error message, falling back gracefully.
function toMessage(err: unknown): string {
  const axiosErr = err as AxiosError<{ error?: { message?: string } }>;
  return axiosErr?.response?.data?.error?.message ?? (err as Error)?.message ?? 'unexpected error';
}

interface AsyncState<T> {
  data: T | undefined;
  loading: boolean;
  error: string | null;
}

// Runs an async fn on mount (and when deps change), exposing loading/error/data
// plus a `reload` for refetching after mutations.
export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList) {
  const [state, setState] = useState<AsyncState<T>>({ data: undefined, loading: true, error: null });

  const run = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    return fn()
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => setState({ data: undefined, loading: false, error: toMessage(err) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { ...state, reload: run };
}
