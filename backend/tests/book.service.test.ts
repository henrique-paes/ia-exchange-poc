/**
 * Tests for book.service — covering book ⇄ tags relation rules
 * Spec refs: docs/specs/book.md, docs/specs/tag.md
 */
import { createBookService } from '../src/modules/books/book.service';
import { NotFoundError } from '../src/errors/AppError';
import { BookRepository } from '../src/modules/books/book.repository';
import { UserService } from '../src/modules/users/user.service';
import { TagRepository } from '../src/modules/tags/tag.repository';
import { Book, Tag } from '@prisma/client';

// ──────────────────────── helpers / fakes ────────────────────────

const aTag = (over: Partial<Tag> = {}): Tag => ({
  id: 'tag-1',
  name: 'Fiction',
  createdAt: new Date(),
  ...over,
});

type BookWithTags = Book & { tags: Tag[] };

const aBook = (over: Partial<BookWithTags> = {}): BookWithTags => ({
  id: 'book-1',
  title: 'My Book',
  author: 'Some Author',
  available: true,
  creatorId: 'user-1',
  createdAt: new Date(),
  tags: [],
  ...over,
});

const fakeBookRepo = (over: Partial<BookRepository> = {}): BookRepository => ({
  create: jest.fn(async (d) => aBook({ title: d.title, author: d.author, creatorId: d.creatorId })),
  findById: jest.fn(async () => null),
  list: jest.fn(async () => []),
  update: jest.fn(async (id) => aBook({ id })),
  ...over,
});

const fakeUsers = (exists = true): UserService =>
  ({
    getById: jest.fn(async (id: string) => {
      if (!exists) throw new NotFoundError('user');
      return { id, name: 'Alice', createdAt: new Date() };
    }),
    create: jest.fn(),
  }) as unknown as UserService;

const fakeTagRepo = (tags: Tag[] = []): TagRepository => ({
  create: jest.fn(),
  findById: jest.fn(),
  list: jest.fn(),
  findByNameInsensitive: jest.fn(),
  findManyByIds: jest.fn(async (ids: string[]) => tags.filter((t) => ids.includes(t.id))),
});

// ──────────────────────────── book.create ────────────────────────────

describe('book.create', () => {
  it('creates a book without tagIds — no error (book.tags.optional)', async () => {
    const repo = fakeBookRepo({
      create: jest.fn(async (d) => aBook(d as Partial<BookWithTags>)),
    });
    const svc = createBookService(repo, fakeUsers(), fakeTagRepo());
    const book = await svc.create({ title: 'T', author: 'A', creatorId: 'user-1' });
    expect(repo.create).toHaveBeenCalled();
    expect(book.tags).toEqual([]);
  });

  it('creates a book with empty tagIds — no error (book.tags.optional)', async () => {
    const repo = fakeBookRepo({
      create: jest.fn(async (d) => aBook(d as Partial<BookWithTags>)),
    });
    const svc = createBookService(repo, fakeUsers(), fakeTagRepo());
    const book = await svc.create({ title: 'T', author: 'A', creatorId: 'user-1', tagIds: [] });
    expect(repo.create).toHaveBeenCalled();
    expect(book.tags).toEqual([]);
  });

  it('rejects when any tagId does not exist — all-or-nothing 404 (book.tags.exists)', async () => {
    const t1 = aTag({ id: 'tag-known', name: 'Fiction' });
    const tagRepo = fakeTagRepo([t1]);
    const bookRepo = fakeBookRepo();
    const svc = createBookService(bookRepo, fakeUsers(), tagRepo);

    await expect(
      svc.create({ title: 'T', author: 'A', creatorId: 'user-1', tagIds: ['tag-known', 'tag-unknown'] }),
    ).rejects.toBeInstanceOf(NotFoundError);

    // repo.create must NOT have been called (all-or-nothing)
    expect(bookRepo.create).not.toHaveBeenCalled();
  });

  it('deduplicates tagIds before linking (book.tags.unique)', async () => {
    const t1 = aTag({ id: 'tag-1', name: 'Fiction' });
    const tagRepo = fakeTagRepo([t1]);
    const capturedArg: { tagIds?: string[] }[] = [];
    const bookRepo = fakeBookRepo({
      create: jest.fn(async (d) => {
        capturedArg.push(d as { tagIds?: string[] });
        return aBook({ tags: [t1] });
      }),
    });
    const svc = createBookService(bookRepo, fakeUsers(), tagRepo);
    await svc.create({ title: 'T', author: 'A', creatorId: 'user-1', tagIds: ['tag-1', 'tag-1'] });

    // repo receives deduplicated list — only one 'tag-1'
    const passedTagIds = capturedArg[0].tagIds ?? [];
    expect(passedTagIds).toHaveLength(1);
    expect(passedTagIds[0]).toBe('tag-1');
  });

  it('returns the created book with hydrated tags (book.list hydration)', async () => {
    const t1 = aTag({ id: 'tag-1', name: 'Fiction' });
    const tagRepo = fakeTagRepo([t1]);
    const bookRepo = fakeBookRepo({
      create: jest.fn(async () => aBook({ tags: [t1] })),
    });
    const svc = createBookService(bookRepo, fakeUsers(), tagRepo);
    const book = await svc.create({ title: 'T', author: 'A', creatorId: 'user-1', tagIds: ['tag-1'] });
    expect(book.tags).toHaveLength(1);
    expect(book.tags[0].id).toBe('tag-1');
  });
});

// ──────────────────────────── book.getById ────────────────────────────

describe('book.getById', () => {
  it('returns the book with hydrated tags when it exists', async () => {
    const t1 = aTag({ id: 'tag-1', name: 'Drama' });
    const bookWithTags = aBook({ id: 'book-42', tags: [t1] });
    const repo = fakeBookRepo({
      findById: jest.fn(async () => bookWithTags),
    });
    const svc = createBookService(repo, fakeUsers(), fakeTagRepo([t1]));
    const result = await svc.getById('book-42');
    expect(result.tags).toHaveLength(1);
    expect(result.tags[0].name).toBe('Drama');
  });

  it('throws NotFoundError for unknown book id', async () => {
    const repo = fakeBookRepo({ findById: jest.fn(async () => null) });
    const svc = createBookService(repo, fakeUsers(), fakeTagRepo());
    await expect(svc.getById('nope')).rejects.toBeInstanceOf(NotFoundError);
  });
});

// ──────────────────────────── book.update ────────────────────────────

describe('book.update', () => {
  it('updates tagIds — repo receives the new set (book.tags.set)', async () => {
    const t1 = aTag({ id: 'tag-1', name: 'Fiction' });
    const t2 = aTag({ id: 'tag-2', name: 'Sci-Fi' });
    const tagRepo = fakeTagRepo([t1, t2]);
    const capturedUpdate: unknown[] = [];
    const bookRepo = fakeBookRepo({
      findById: jest.fn(async () => aBook({ id: 'book-1', tags: [t1] })),
      update: jest.fn(async (id, data) => {
        capturedUpdate.push({ id, data });
        return aBook({ id, tags: [t1, t2] });
      }),
    });
    const svc = createBookService(bookRepo, fakeUsers(), tagRepo);
    const result = await svc.update('book-1', { tagIds: ['tag-1', 'tag-2'] });

    expect(bookRepo.update).toHaveBeenCalledWith('book-1', expect.objectContaining({ tagIds: expect.arrayContaining(['tag-1', 'tag-2']) }));
    expect(result.tags).toHaveLength(2);
  });

  it('omitting tagIds does NOT pass tagIds to repo (book.tags.set — no touch)', async () => {
    const t1 = aTag({ id: 'tag-1', name: 'Fiction' });
    const bookRepo = fakeBookRepo({
      findById: jest.fn(async () => aBook({ id: 'book-1', tags: [t1] })),
      update: jest.fn(async (id) => aBook({ id, tags: [t1] })),
    });
    const svc = createBookService(bookRepo, fakeUsers(), fakeTagRepo([t1]));
    await svc.update('book-1', { title: 'New Title' });

    const callArg = (bookRepo.update as jest.Mock).mock.calls[0][1];
    expect(callArg).not.toHaveProperty('tagIds');
  });

  it('throws NotFoundError when book does not exist (update 404)', async () => {
    const repo = fakeBookRepo({ findById: jest.fn(async () => null) });
    const svc = createBookService(repo, fakeUsers(), fakeTagRepo());
    await expect(svc.update('nope', { title: 'X' })).rejects.toBeInstanceOf(NotFoundError);
  });

  it('rejects unknown tagId on update — all-or-nothing 404 (book.tags.exists)', async () => {
    const t1 = aTag({ id: 'tag-1', name: 'Fiction' });
    const tagRepo = fakeTagRepo([t1]);
    const bookRepo = fakeBookRepo({
      findById: jest.fn(async () => aBook({ id: 'book-1', tags: [] })),
      update: jest.fn(),
    });
    const svc = createBookService(bookRepo, fakeUsers(), tagRepo);

    await expect(svc.update('book-1', { tagIds: ['tag-1', 'tag-unknown'] })).rejects.toBeInstanceOf(NotFoundError);
    expect(bookRepo.update).not.toHaveBeenCalled();
  });

  it('deduplicates tagIds on update (book.tags.unique)', async () => {
    const t1 = aTag({ id: 'tag-1', name: 'Fiction' });
    const tagRepo = fakeTagRepo([t1]);
    const capturedArg: { tagIds?: string[] }[] = [];
    const bookRepo = fakeBookRepo({
      findById: jest.fn(async () => aBook({ id: 'book-1', tags: [] })),
      update: jest.fn(async (id, data) => {
        capturedArg.push(data as { tagIds?: string[] });
        return aBook({ id, tags: [t1] });
      }),
    });
    const svc = createBookService(bookRepo, fakeUsers(), tagRepo);
    await svc.update('book-1', { tagIds: ['tag-1', 'tag-1'] });

    const passedTagIds = capturedArg[0].tagIds ?? [];
    expect(passedTagIds).toHaveLength(1);
    expect(passedTagIds[0]).toBe('tag-1');
  });
});

// ──────────────────────────── book.list ────────────────────────────

describe('book.list', () => {
  it('returns all books with tags when no filter is provided', async () => {
    const t1 = aTag({ id: 'tag-1', name: 'Fiction' });
    const books = [aBook({ id: 'b1', tags: [t1] }), aBook({ id: 'b2', tags: [] })];
    const repo = fakeBookRepo({ list: jest.fn(async () => books) });
    const svc = createBookService(repo, fakeUsers(), fakeTagRepo([t1]));
    const result = await svc.list();
    expect(repo.list).toHaveBeenCalledWith(undefined);
    expect(result).toHaveLength(2);
  });

  it('passes tagIds filter to repo (book.filterByTags)', async () => {
    const t1 = aTag({ id: 'tag-1', name: 'Fiction' });
    const books = [aBook({ id: 'b1', tags: [t1] })];
    const repo = fakeBookRepo({ list: jest.fn(async () => books) });
    const svc = createBookService(repo, fakeUsers(), fakeTagRepo([t1]));
    const result = await svc.list({ tagIds: ['tag-1'] });
    expect(repo.list).toHaveBeenCalledWith({ tagIds: ['tag-1'] });
    expect(result).toHaveLength(1);
  });
});

// ──────────────────── updateBookSchema validation ────────────────────

describe('updateBookSchema', () => {
  const { updateBookSchema } = require('../src/modules/books/book.schema');

  it('accepts partial body with only title', () => {
    const result = updateBookSchema.safeParse({ title: 'New Title' });
    expect(result.success).toBe(true);
  });

  it('accepts body with tagIds only', () => {
    const result = updateBookSchema.safeParse({ tagIds: ['00000000-0000-0000-0000-000000000001'] });
    expect(result.success).toBe(true);
  });

  it('rejects empty object — book.update.noFields', () => {
    const result = updateBookSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('rejects tagIds with non-uuid values', () => {
    const result = updateBookSchema.safeParse({ tagIds: ['not-a-uuid'] });
    expect(result.success).toBe(false);
  });
});
