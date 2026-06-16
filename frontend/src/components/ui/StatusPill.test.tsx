import { render, screen } from '@testing-library/react';
import { StatusPill } from './StatusPill';

describe('StatusPill', () => {
  it('renders its text label (not color-only)', () => {
    render(<StatusPill tone="success">available</StatusPill>);
    expect(screen.getByText('available')).toBeInTheDocument();
  });
});
