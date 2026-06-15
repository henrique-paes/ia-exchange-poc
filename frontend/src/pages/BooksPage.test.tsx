import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BooksPage } from './BooksPage';
import { listBooks } from '../api/books';
import { listUsers } from '../api/users';
import { rentBook } from '../api/rentals';

vi.mock('../api/books', () => ({ listBooks: vi.fn(), createBook: vi.fn() }));
vi.mock('../api/users', () => ({ listUsers: vi.fn(), createUser: vi.fn() }));
vi.mock('../api/rentals', () => ({ rentBook: vi.fn(), returnRental: vi.fn() }));

const book = (id: string, title: string, available: boolean) => ({
  id,
  title,
  author: 'A',
  available,
  creatorId: 'u1',
  createdAt: '',
});

beforeEach(() => {
  vi.mocked(listBooks).mockResolvedValue([book('b1', 'Rented', false), book('b2', 'Free', true)]);
  vi.mocked(listUsers).mockResolvedValue([{ id: 'u1', name: 'Alice', createdAt: '' }]);
  vi.mocked(rentBook).mockResolvedValue({
    id: 'r1',
    userId: 'u1',
    bookId: 'b2',
    rentedAt: '',
    returnedAt: null,
  });
});

const rowFor = (text: string) => screen.getByText(new RegExp(text)).closest('li') as HTMLElement;

describe('BooksPage (CARD-032/033)', () => {
  it('disables Rent until a user is chosen and never enables it for rented books', async () => {
    render(<BooksPage />);
    await screen.findByText(/Rented/);

    // no actor selected yet → both disabled
    expect(within(rowFor('Free')).getByRole('button', { name: 'Rent' })).toBeDisabled();

    await userEvent.selectOptions(screen.getByLabelText('rent as'), 'u1');

    expect(within(rowFor('Free')).getByRole('button', { name: 'Rent' })).toBeEnabled();
    expect(within(rowFor('Rented')).getByRole('button', { name: 'Rent' })).toBeDisabled();
  });

  it('rents an available book', async () => {
    render(<BooksPage />);
    await screen.findByText(/Free/);
    await userEvent.selectOptions(screen.getByLabelText('rent as'), 'u1');
    await userEvent.click(within(rowFor('Free')).getByRole('button', { name: 'Rent' }));
    await waitFor(() => expect(rentBook).toHaveBeenCalledWith('u1', 'b2'));
  });
});
