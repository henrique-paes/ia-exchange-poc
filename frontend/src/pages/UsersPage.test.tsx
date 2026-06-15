import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UsersPage } from './UsersPage';
import { createUser, listUsers } from '../api/users';

vi.mock('../api/users', () => ({ listUsers: vi.fn(), createUser: vi.fn() }));

const user = (id: string, name: string) => ({ id, name, createdAt: '' });

beforeEach(() => {
  vi.mocked(listUsers).mockResolvedValue([user('1', 'Alice')]);
  vi.mocked(createUser).mockResolvedValue(user('2', 'Bob'));
});

describe('UsersPage (CARD-031)', () => {
  it('renders the user list', async () => {
    render(<UsersPage />);
    expect(await screen.findByText('Alice')).toBeInTheDocument();
  });

  it('creates a user and refreshes the list', async () => {
    render(<UsersPage />);
    await screen.findByText('Alice');
    vi.mocked(listUsers).mockResolvedValue([user('1', 'Alice'), user('2', 'Bob')]);

    await userEvent.type(screen.getByLabelText('name'), 'Bob');
    await userEvent.click(screen.getByRole('button', { name: /create user/i }));

    await waitFor(() => expect(createUser).toHaveBeenCalledWith('Bob'));
    expect(await screen.findByText('Bob')).toBeInTheDocument();
  });
});
