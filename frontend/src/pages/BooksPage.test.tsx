import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BooksPage } from './BooksPage';
import { listBooks, createBook, updateBook } from '../api/books';
import { listUsers } from '../api/users';
import { rentBook } from '../api/rentals';
import { listTags } from '../api/tags';

vi.mock('../api/books', () => ({
  listBooks: vi.fn(),
  createBook: vi.fn(),
  updateBook: vi.fn(),
}));
vi.mock('../api/users', () => ({ listUsers: vi.fn(), createUser: vi.fn() }));
vi.mock('../api/rentals', () => ({ rentBook: vi.fn(), returnRental: vi.fn() }));
vi.mock('../api/tags', () => ({ listTags: vi.fn(), createTag: vi.fn() }));

const book = (
  id: string,
  title: string,
  available: boolean,
  tags: { id: string; name: string; createdAt: string }[] = [],
) => ({
  id,
  title,
  author: 'A',
  available,
  creatorId: 'u1',
  createdAt: '',
  tags,
});

const TAG_SCI_FI = { id: 'tag-1', name: 'Sci-Fi', createdAt: '' };
const TAG_MYSTERY = { id: 'tag-2', name: 'Mystery', createdAt: '' };

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
  vi.mocked(listTags).mockResolvedValue([TAG_SCI_FI, TAG_MYSTERY]);
  vi.mocked(createBook).mockResolvedValue(book('b3', 'New Book', true));
  vi.mocked(updateBook).mockResolvedValue(book('b2', 'Free', true, [TAG_SCI_FI]));
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

describe('BooksPage — tags (U10/T22-T26)', () => {
  it('create book sends tagIds when tags are selected (ui-tags.md §2 — book.tags.optional)', async () => {
    render(<BooksPage />);
    // wait for tags to load
    await screen.findByText(/Rented/);

    // Fill create form
    await userEvent.type(screen.getByLabelText('title'), 'New Book');
    await userEvent.type(screen.getByLabelText('author'), 'Author X');
    await userEvent.selectOptions(screen.getByLabelText('creator'), 'u1');

    // Select Sci-Fi tag in the "book tags" picker (inside create form)
    // There are two TagPickers with aria-label="book tags" — one in create form, one per row in edit mode.
    // use getAllByRole to find fieldsets with aria-label "book tags" and pick the first
    const bookTagsPickers = screen.getAllByRole('group', { name: 'book tags' });
    // The create form picker is the first one rendered
    const createFormPicker = bookTagsPickers[0];
    const sciFiCheckbox = within(createFormPicker).getByRole('checkbox', { name: /Sci-Fi/i });
    await userEvent.click(sciFiCheckbox);

    await userEvent.click(screen.getByRole('button', { name: 'Create book' }));

    await waitFor(() =>
      expect(createBook).toHaveBeenCalledWith(
        expect.objectContaining({ tagIds: ['tag-1'] }),
      ),
    );
  });

  it('each book displays its tags as pills (ui-tags.md §4)', async () => {
    vi.mocked(listBooks).mockResolvedValue([
      book('b1', 'Tagged Book', true, [TAG_SCI_FI, TAG_MYSTERY]),
    ]);
    render(<BooksPage />);
    await screen.findByText('Tagged Book');

    const row = rowFor('Tagged Book');
    expect(within(row).getByText('Sci-Fi')).toBeInTheDocument();
    expect(within(row).getByText('Mystery')).toBeInTheDocument();
  });

  it('filter by tags calls listBooks with tagIds (ui-tags.md §5 — book.filterByTags)', async () => {
    render(<BooksPage />);
    await screen.findByText(/Rented/);

    // Select tag in filter picker
    const filterPicker = screen.getByRole('group', { name: 'filter by tags' });
    const sciFiCheck = within(filterPicker).getByRole('checkbox', { name: /Sci-Fi/i });

    vi.mocked(listBooks).mockResolvedValue([]);
    await userEvent.click(sciFiCheck);

    await waitFor(() =>
      expect(listBooks).toHaveBeenCalledWith(['tag-1']),
    );
  });

  it('edit tags calls updateBook with selected tagIds (ui-tags.md §3 — book.tags.set)', async () => {
    render(<BooksPage />);
    await screen.findByText(/Free/);

    const freeRow = rowFor('Free');
    await userEvent.click(within(freeRow).getByRole('button', { name: 'Edit tags' }));

    // In edit mode, a TagPicker with aria-label "book tags" appears in the row
    const editPicker = within(freeRow).getByRole('group', { name: 'book tags' });
    const sciFiCheck = within(editPicker).getByRole('checkbox', { name: /Sci-Fi/i });
    await userEvent.click(sciFiCheck);

    await userEvent.click(within(freeRow).getByRole('button', { name: 'Save tags' }));

    await waitFor(() =>
      expect(updateBook).toHaveBeenCalledWith('b2', { tagIds: ['tag-1'] }),
    );
  });
});
