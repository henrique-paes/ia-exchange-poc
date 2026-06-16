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

describe('unknown route', () => {
  it('returns 404 not_found', async () => {
    const res = await request(app).get('/nope');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('not_found');
  });
});
