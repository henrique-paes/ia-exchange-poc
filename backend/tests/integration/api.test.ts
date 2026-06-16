import request from 'supertest';
import { createApp } from '../../src/app';
import { resetDb, prisma } from '../helpers/db';

const app = createApp();

beforeEach(resetDb);
afterAll(() => prisma.$disconnect());

const newUser = (name = 'Alice') => request(app).post('/users').send({ name });
const newBook = (creatorId: string, over = {}) =>
  request(app).post('/books').send({ title: 'T', author: 'A', creatorId, ...over });

describe('users API', () => {
  it('rejects an invalid name with 400 validation_error (user.name.length)', async () => {
    const res = await request(app).post('/users').send({ name: 'x' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('validation_error');
  });

  it('creates a user (201) and reads it back', async () => {
    const created = await newUser();
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({ name: 'Alice' });
    const got = await request(app).get(`/users/${created.body.id}`);
    expect(got.status).toBe(200);
  });

  it('lists users', async () => {
    await newUser('Alice');
    await newUser('Bob');
    const list = await request(app).get('/users');
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(2);
  });

  it('returns 404 for an unknown user', async () => {
    const res = await request(app).get('/users/00000000-0000-0000-0000-000000000000');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('not_found');
  });
});

describe('books API', () => {
  it('rejects creation by an unknown creator with 404 (book.creator.exists)', async () => {
    const res = await newBook('00000000-0000-0000-0000-000000000000');
    expect(res.status).toBe(404);
  });

  it('creates a book that starts available (201)', async () => {
    const user = await newUser();
    const res = await newBook(user.body.id);
    expect(res.status).toBe(201);
    expect(res.body.available).toBe(true);
  });

  it('lists books and 404s an unknown book', async () => {
    const user = await newUser();
    await newBook(user.body.id);
    const list = await request(app).get('/books');
    expect(list.body).toHaveLength(1);
    const unknown = await request(app).get('/books/00000000-0000-0000-0000-000000000000');
    expect(unknown.status).toBe(404);
  });

  it('rejects non-uuid tagIds in query with 400 (book.filterByTags — query validation)', async () => {
    // qs nested objects like ?tagIds[a]=b must not reach the service
    const res = await request(app).get('/books?tagIds=not-a-uuid');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('validation_error');
  });

  it('accepts valid uuid tagIds in query (book.filterByTags)', async () => {
    const res = await request(app).get(
      '/books?tagIds=00000000-0000-0000-0000-000000000001',
    );
    // Unknown tag IDs simply produce no matches (empty list), not an error
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('rentals API', () => {
  it('rents then returns, flipping book availability (rent/return.effect)', async () => {
    const user = await newUser();
    const book = await newBook(user.body.id);

    const rent = await request(app).post('/rentals').send({ userId: user.body.id, bookId: book.body.id });
    expect(rent.status).toBe(201);
    expect((await request(app).get(`/books/${book.body.id}`)).body.available).toBe(false);

    const ret = await request(app).post(`/rentals/${rent.body.id}/return`).send();
    expect(ret.status).toBe(200);
    expect((await request(app).get(`/books/${book.body.id}`)).body.available).toBe(true);
  });

  it('rejects renting an already-rented book with 409 (rental.availability)', async () => {
    const user = await newUser();
    const book = await newBook(user.body.id);
    await request(app).post('/rentals').send({ userId: user.body.id, bookId: book.body.id });
    const again = await request(app).post('/rentals').send({ userId: user.body.id, bookId: book.body.id });
    expect(again.status).toBe(409);
    expect(again.body.error.code).toBe('conflict');
  });

  it('enforces the 3 active-rentals-per-user limit with 409 (rental.limit)', async () => {
    const user = await newUser();
    for (let i = 0; i < 3; i++) {
      const book = await newBook(user.body.id);
      const r = await request(app).post('/rentals').send({ userId: user.body.id, bookId: book.body.id });
      expect(r.status).toBe(201);
    }
    const extra = await newBook(user.body.id);
    const overLimit = await request(app).post('/rentals').send({ userId: user.body.id, bookId: extra.body.id });
    expect(overLimit.status).toBe(409);
  });

  it('lists rentals for a user', async () => {
    const user = await newUser();
    const book = await newBook(user.body.id);
    await request(app).post('/rentals').send({ userId: user.body.id, bookId: book.body.id });
    const list = await request(app).get(`/users/${user.body.id}/rentals`);
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
  });
});

describe('tags API', () => {
  it('creates a tag (201) and reads it back via GET /tags/:id (tag.create + tag.getById)', async () => {
    const create = await request(app).post('/tags').send({ name: 'Fiction' });
    expect(create.status).toBe(201);
    expect(create.body).toMatchObject({ name: 'Fiction' });
    expect(typeof create.body.id).toBe('string');

    const get = await request(app).get(`/tags/${create.body.id}`);
    expect(get.status).toBe(200);
    expect(get.body.id).toBe(create.body.id);
    expect(get.body.name).toBe('Fiction');
  });

  it('rejects duplicate tag name case-insensitively (tag.md tag.name.unique → 409)', async () => {
    await request(app).post('/tags').send({ name: 'Sci-Fi' });
    const dup = await request(app).post('/tags').send({ name: 'sci-fi' });
    expect(dup.status).toBe(409);
    expect(dup.body.error.code).toBe('conflict');
  });

  it('lists tags ordered by name asc (tag.list)', async () => {
    await request(app).post('/tags').send({ name: 'Zebra' });
    await request(app).post('/tags').send({ name: 'Alpha' });
    await request(app).post('/tags').send({ name: 'Middle' });

    const list = await request(app).get('/tags');
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(3);
    expect(list.body[0].name).toBe('Alpha');
    expect(list.body[1].name).toBe('Middle');
    expect(list.body[2].name).toBe('Zebra');
  });

  it('returns 404 for unknown tag id (tag.getById → not_found)', async () => {
    const res = await request(app).get('/tags/00000000-0000-0000-0000-000000000000');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('not_found');
  });

  it('rejects POST /tags with invalid name (tag.name.required / tag.name.length → 400)', async () => {
    // empty string
    const empty = await request(app).post('/tags').send({ name: '' });
    expect(empty.status).toBe(400);
    expect(empty.body.error.code).toBe('validation_error');

    // only whitespace — trimmed to 0 chars violates min(1)
    const spaces = await request(app).post('/tags').send({ name: '   ' });
    expect(spaces.status).toBe(400);
    expect(spaces.body.error.code).toBe('validation_error');

    // 41 chars — exceeds max(40)
    const tooLong = await request(app)
      .post('/tags')
      .send({ name: 'a'.repeat(41) });
    expect(tooLong.status).toBe(400);
    expect(tooLong.body.error.code).toBe('validation_error');
  });
});

describe('books ⇄ tags', () => {
  it('creates book with valid tagIds → 201 with hydrated tags (book.tags.optional / book.create)', async () => {
    const user = await newUser();
    const tag = await request(app).post('/tags').send({ name: 'SciFi' });
    expect(tag.status).toBe(201);

    const book = await newBook(user.body.id, { tagIds: [tag.body.id] });
    expect(book.status).toBe(201);
    expect(Array.isArray(book.body.tags)).toBe(true);
    expect(book.body.tags).toHaveLength(1);
    expect(book.body.tags[0].id).toBe(tag.body.id);
    expect(book.body.tags[0].name).toBe('SciFi');
  });

  it('rejects book creation with unknown tagId → 404 and book is not created (book.tags.exists)', async () => {
    const user = await newUser();
    const unknownTagId = '00000000-0000-0000-0000-000000000099';

    const create = await newBook(user.body.id, { tagIds: [unknownTagId] });
    expect(create.status).toBe(404);
    expect(create.body.error.code).toBe('not_found');

    // book must not have been persisted
    const list = await request(app).get('/books');
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(0);
  });

  it('deduplicates repeated tagIds on create → book linked once (book.tags.unique)', async () => {
    const user = await newUser();
    const tag = await request(app).post('/tags').send({ name: 'Fantasy' });

    const book = await newBook(user.body.id, { tagIds: [tag.body.id, tag.body.id] });
    expect(book.status).toBe(201);
    expect(book.body.tags).toHaveLength(1);
    expect(book.body.tags[0].id).toBe(tag.body.id);
  });

  it('PATCH /books/:id substitutes tag set; omitting tagIds preserves; [] clears (book.tags.set)', async () => {
    const user = await newUser();
    const t1 = await request(app).post('/tags').send({ name: 'TagA' });
    const t2 = await request(app).post('/tags').send({ name: 'TagB' });
    const t3 = await request(app).post('/tags').send({ name: 'TagC' });

    // create with t1
    const created = await newBook(user.body.id, { tagIds: [t1.body.id] });
    expect(created.status).toBe(201);
    const bookId = created.body.id;

    // patch substitutes: t1 → t2+t3
    const patch1 = await request(app)
      .patch(`/books/${bookId}`)
      .send({ tagIds: [t2.body.id, t3.body.id] });
    expect(patch1.status).toBe(200);
    const tagIds1 = patch1.body.tags.map((t: { id: string }) => t.id).sort();
    expect(tagIds1).toEqual([t2.body.id, t3.body.id].sort());

    // patch without tagIds — existing tags preserved
    const patch2 = await request(app)
      .patch(`/books/${bookId}`)
      .send({ title: 'New Title' });
    expect(patch2.status).toBe(200);
    const tagIds2 = patch2.body.tags.map((t: { id: string }) => t.id).sort();
    expect(tagIds2).toEqual([t2.body.id, t3.body.id].sort());

    // patch with [] — clears all tags
    const patch3 = await request(app)
      .patch(`/books/${bookId}`)
      .send({ tagIds: [] });
    expect(patch3.status).toBe(200);
    expect(patch3.body.tags).toHaveLength(0);
  });

  it('GET /books?tagIds= AND/match-all returns only books with ALL given tags, each with full tags (book.filterByTags)', async () => {
    const user = await newUser();
    const t1 = await request(app).post('/tags').send({ name: 'TagX' });
    const t2 = await request(app).post('/tags').send({ name: 'TagY' });

    // bookBoth has t1 + t2
    const bookBoth = await newBook(user.body.id, { tagIds: [t1.body.id, t2.body.id] });
    expect(bookBoth.status).toBe(201);

    // bookOne has only t1
    const bookOne = await newBook(user.body.id, { tagIds: [t1.body.id] });
    expect(bookOne.status).toBe(201);

    // bookNone has no tags
    const bookNone = await newBook(user.body.id);
    expect(bookNone.status).toBe(201);

    // filter by t1 only → should return bookBoth + bookOne (both have t1)
    const resT1 = await request(app).get(
      `/books?tagIds=${t1.body.id}`,
    );
    expect(resT1.status).toBe(200);
    expect(resT1.body).toHaveLength(2);
    const idsT1 = resT1.body.map((b: { id: string }) => b.id);
    expect(idsT1).toContain(bookBoth.body.id);
    expect(idsT1).toContain(bookOne.body.id);

    // filter by t1 AND t2 → should return only bookBoth
    const resT1T2 = await request(app).get(
      `/books?tagIds=${t1.body.id}&tagIds=${t2.body.id}`,
    );
    expect(resT1T2.status).toBe(200);
    expect(resT1T2.body).toHaveLength(1);
    expect(resT1T2.body[0].id).toBe(bookBoth.body.id);

    // each returned book has full tags hydrated
    const returnedBook = resT1T2.body[0];
    expect(Array.isArray(returnedBook.tags)).toBe(true);
    expect(returnedBook.tags).toHaveLength(2);
    const returnedTagIds = returnedBook.tags.map((t: { id: string }) => t.id).sort();
    expect(returnedTagIds).toEqual([t1.body.id, t2.body.id].sort());
  });
});

describe('unknown route', () => {
  it('returns 404 not_found', async () => {
    const res = await request(app).get('/nope');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('not_found');
  });
});
