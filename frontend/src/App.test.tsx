import { render, screen, act } from '@testing-library/react';
import App from './App';

vi.mock('./api/books', () => ({
  listBooks: vi.fn().mockResolvedValue([]),
  createBook: vi.fn(),
}));
vi.mock('./api/users', () => ({
  listUsers: vi.fn().mockResolvedValue([]),
  createUser: vi.fn(),
  listUserRentals: vi.fn().mockResolvedValue([]),
}));
vi.mock('./api/rentals', () => ({ rentBook: vi.fn(), returnRental: vi.fn() }));
vi.mock('./api/tags', () => ({ listTags: vi.fn().mockResolvedValue([]), createTag: vi.fn() }));

describe('App', () => {
  it('renders the nav and resolves the default route (CARD-030)', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByRole('link', { name: 'Books' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Users' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Rentals' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Books' })).toBeInTheDocument();
  });
});
