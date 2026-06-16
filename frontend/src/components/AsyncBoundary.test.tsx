import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AsyncBoundary } from './AsyncBoundary';

describe('AsyncBoundary', () => {
  it('renders a loading status', () => {
    render(
      <AsyncBoundary loading error={null}>
        <p>content</p>
      </AsyncBoundary>,
    );
    expect(screen.getByRole('status')).toHaveTextContent(/loading/i);
  });

  it('renders an error alert with a working Retry', async () => {
    const onRetry = vi.fn();
    render(
      <AsyncBoundary loading={false} error="boom" onRetry={onRetry}>
        <p>content</p>
      </AsyncBoundary>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('boom');
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalled();
  });

  it('renders children when settled', () => {
    render(
      <AsyncBoundary loading={false} error={null}>
        <p>content</p>
      </AsyncBoundary>,
    );
    expect(screen.getByText('content')).toBeInTheDocument();
  });
});
