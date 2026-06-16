import { createTagService } from '../src/modules/tags/tag.service';
import { ConflictError, NotFoundError } from '../src/errors/AppError';
import { TagRepository } from '../src/modules/tags/tag.repository';
import { Tag } from '@prisma/client';

// Fakes let us exercise the rules (docs/specs/tag.md) without a database.
const aTag = (over: Partial<Tag> = {}): Tag => ({
  id: 'tag-1',
  name: 'Fiction',
  createdAt: new Date(),
  ...over,
});

const fakeRepo = (over: Partial<TagRepository> = {}): TagRepository => ({
  create: jest.fn(async (d) => aTag(d)),
  findById: jest.fn(async () => null),
  list: jest.fn(async () => []),
  findByNameInsensitive: jest.fn(async () => null),
  findManyByIds: jest.fn(async () => []),
  ...over,
});

describe('tag.create', () => {
  it('creates and returns the new tag (tag.create)', async () => {
    const repo = fakeRepo();
    const svc = createTagService(repo);
    const tag = await svc.create({ name: 'Fiction' });
    expect(repo.create).toHaveBeenCalledWith({ name: 'Fiction' });
    expect(tag.name).toBe('Fiction');
  });

  it('rejects duplicate name case-insensitively (tag.md tag.name.unique)', async () => {
    const existing = aTag({ name: 'Sci-Fi' });
    const repo = fakeRepo({
      findByNameInsensitive: jest.fn(async () => existing),
    });
    const svc = createTagService(repo);
    await expect(svc.create({ name: 'sci-fi' })).rejects.toBeInstanceOf(ConflictError);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('rejects duplicate name with exact same casing (tag.md tag.name.unique)', async () => {
    const existing = aTag({ name: 'Drama' });
    const repo = fakeRepo({
      findByNameInsensitive: jest.fn(async () => existing),
    });
    const svc = createTagService(repo);
    await expect(svc.create({ name: 'Drama' })).rejects.toBeInstanceOf(ConflictError);
  });
});

describe('tag.list', () => {
  it('returns all tags ordered by name ascending (tag.list)', async () => {
    const tags = [
      aTag({ id: 't1', name: 'Action' }),
      aTag({ id: 't2', name: 'Biography' }),
      aTag({ id: 't3', name: 'Comedy' }),
    ];
    const repo = fakeRepo({ list: jest.fn(async () => tags) });
    const svc = createTagService(repo);
    const result = await svc.list();
    expect(repo.list).toHaveBeenCalled();
    expect(result).toEqual(tags);
  });
});

describe('tag.getById', () => {
  it('returns the tag when it exists (tag.getById)', async () => {
    const tag = aTag({ id: 'tag-42', name: 'Thriller' });
    const repo = fakeRepo({ findById: jest.fn(async () => tag) });
    const svc = createTagService(repo);
    const result = await svc.getById('tag-42');
    expect(result).toEqual(tag);
  });

  it('throws NotFoundError when the tag does not exist (tag.exists)', async () => {
    const repo = fakeRepo({ findById: jest.fn(async () => null) });
    const svc = createTagService(repo);
    await expect(svc.getById('nonexistent')).rejects.toBeInstanceOf(NotFoundError);
  });
});
