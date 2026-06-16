import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TagsPage } from './TagsPage';
import { createTag, listTags } from '../api/tags';

vi.mock('../api/tags', () => ({ listTags: vi.fn(), createTag: vi.fn() }));

const tag = (id: string, name: string) => ({ id, name, createdAt: '2024-01-01T00:00:00.000Z' });

beforeEach(() => {
  vi.mocked(listTags).mockResolvedValue([tag('1', 'Sci-Fi'), tag('2', 'Fantasy')]);
  vi.mocked(createTag).mockResolvedValue(tag('3', 'Horror'));
});

describe('TagsPage (ui-tags.md §1, tag.md)', () => {
  it('renders the tag list (tag.list)', async () => {
    render(<TagsPage />);
    expect(await screen.findByText('Sci-Fi')).toBeInTheDocument();
    expect(screen.getByText('Fantasy')).toBeInTheDocument();
  });

  it('shows empty state when no tags exist (tag.list retornando [])', async () => {
    vi.mocked(listTags).mockResolvedValue([]);
    render(<TagsPage />);
    expect(
      await screen.findByText(/No tags yet/i),
    ).toBeInTheDocument();
  });

  it('disables Create tag button when name is empty (tag.name.required)', async () => {
    render(<TagsPage />);
    await screen.findByText('Sci-Fi');
    expect(screen.getByRole('button', { name: /create tag/i })).toBeDisabled();
  });

  it('disables Create tag button when trimmed name exceeds 40 chars (tag.name.length)', async () => {
    render(<TagsPage />);
    await screen.findByText('Sci-Fi');
    await userEvent.type(
      screen.getByLabelText('tag name'),
      'a'.repeat(41),
    );
    expect(screen.getByRole('button', { name: /create tag/i })).toBeDisabled();
  });

  it('enables Create tag button when name is valid (ui-tags.md §1.2)', async () => {
    render(<TagsPage />);
    await screen.findByText('Sci-Fi');
    await userEvent.type(screen.getByLabelText('tag name'), 'Horror');
    expect(screen.getByRole('button', { name: /create tag/i })).toBeEnabled();
  });

  it('calls createTag with trimmed name and reloads list on success (tag.create)', async () => {
    vi.mocked(listTags)
      .mockResolvedValueOnce([tag('1', 'Sci-Fi'), tag('2', 'Fantasy')])
      .mockResolvedValue([tag('1', 'Sci-Fi'), tag('2', 'Fantasy'), tag('3', 'Horror')]);

    render(<TagsPage />);
    await screen.findByText('Sci-Fi');

    await userEvent.type(screen.getByLabelText('tag name'), '  Horror  ');
    await userEvent.click(screen.getByRole('button', { name: /create tag/i }));

    await waitFor(() => expect(createTag).toHaveBeenCalledWith('Horror'));
    expect(await screen.findByText('Horror')).toBeInTheDocument();
  });

  it('displays 409 conflict error message below input (tag.name.unique)', async () => {
    vi.mocked(createTag).mockRejectedValue({
      response: { data: { error: { message: 'Tag name already exists' } } },
    });

    render(<TagsPage />);
    await screen.findByText('Sci-Fi');

    await userEvent.type(screen.getByLabelText('tag name'), 'Sci-Fi');
    await userEvent.click(screen.getByRole('button', { name: /create tag/i }));

    expect(await screen.findByText('Tag name already exists')).toBeInTheDocument();
    expect(screen.getByLabelText('tag name')).toHaveAttribute('aria-invalid', 'true');
  });
});
