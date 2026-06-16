import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RentalsPage } from './RentalsPage';
import { listUsers, listUserRentals } from '../api/users';
import { listBooks } from '../api/books';
import { returnRental } from '../api/rentals';

vi.mock('../api/users', () => ({
  listUsers: vi.fn(),
  listUserRentals: vi.fn(),
  createUser: vi.fn(),
}));
vi.mock('../api/books', () => ({ listBooks: vi.fn(), createBook: vi.fn() }));
vi.mock('../api/rentals', () => ({ returnRental: vi.fn(), rentBook: vi.fn() }));

const rental = (returnedAt: string | null) => ({
  id: 'r1',
  userId: 'u1',
  bookId: 'b1',
  rentedAt: '',
  returnedAt,
});

beforeEach(() => {
  vi.mocked(listUsers).mockResolvedValue([{ id: 'u1', name: 'Alice', createdAt: '' }]);
  vi.mocked(listBooks).mockResolvedValue([
    { id: 'b1', title: 'Dune', author: 'A', available: false, creatorId: 'u1', createdAt: '', tags: [] },
  ]);
  vi.mocked(listUserRentals).mockResolvedValue([rental(null)]);
  vi.mocked(returnRental).mockResolvedValue(rental('2026-01-01'));
});

describe('RentalsPage (CARD-033)', () => {
  it('lists a user rentals by book title and returns an active one', async () => {
    render(<RentalsPage />);
    await userEvent.selectOptions(await screen.findByLabelText('user'), 'u1');

    expect(await screen.findByText(/Dune/)).toBeInTheDocument();
    vi.mocked(listUserRentals).mockResolvedValue([rental('2026-01-01')]);

    await userEvent.click(screen.getByRole('button', { name: 'Return' }));
    await waitFor(() => expect(returnRental).toHaveBeenCalledWith('r1'));
  });
});
