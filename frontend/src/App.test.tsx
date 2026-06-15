import { render, screen } from '@testing-library/react';
import App from './App';

// Smoke test — proves the TDD harness (vitest + RTL) works.
describe('App', () => {
  it('renders the title', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /library/i })).toBeInTheDocument();
  });
});
