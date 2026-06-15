import {
  createRentalService,
  MAX_ACTIVE_RENTALS_PER_USER,
} from '../src/modules/rentals/rental.service';
import { ConflictError, NotFoundError } from '../src/errors/AppError';
import { UserService } from '../src/modules/users/user.service';
import { BookService } from '../src/modules/books/book.service';
import { RentalRepository } from '../src/modules/rentals/rental.repository';

// Fakes let us exercise the rules (docs/specs/rental.md) without a database.
const aRental = (over = {}) => ({
  id: 'r1',
  userId: 'u1',
  bookId: 'b1',
  rentedAt: new Date(),
  returnedAt: null as Date | null,
  ...over,
});

const fakeRepo = (over: Partial<RentalRepository> = {}): RentalRepository => ({
  rent: jest.fn(async (d) => aRental(d)),
  return: jest.fn(async (id) => aRental({ id, returnedAt: new Date() })),
  findById: jest.fn(async () => null),
  countActiveByUser: jest.fn(async () => 0),
  listByUser: jest.fn(async () => []),
  ...over,
});

const fakeUsers = (exists = true): UserService =>
  ({
    getById: jest.fn(async (id: string) => {
      if (!exists) throw new NotFoundError('user');
      return { id, name: 'x', createdAt: new Date() };
    }),
    create: jest.fn(),
  }) as unknown as UserService;

const fakeBooks = (book: Record<string, unknown> | Error = {}): BookService =>
  ({
    getById: jest.fn(async (id: string) => {
      if (book instanceof Error) throw book;
      return { id, title: 't', author: 'a', available: true, creatorId: 'u1', createdAt: new Date(), ...book };
    }),
    create: jest.fn(),
    list: jest.fn(),
  }) as unknown as BookService;

const input = { userId: 'u1', bookId: 'b1' };

describe('rental.rent', () => {
  it('creates an active rental and marks the book unavailable (rental.rent.effect)', async () => {
    const repo = fakeRepo();
    const svc = createRentalService(repo, fakeUsers(), fakeBooks());
    const rental = await svc.rent(input);
    expect(repo.rent).toHaveBeenCalledWith(input);
    expect(rental.returnedAt).toBeNull();
  });

  it('rejects renting an unavailable book with a conflict (rental.availability)', async () => {
    const svc = createRentalService(fakeRepo(), fakeUsers(), fakeBooks({ available: false }));
    await expect(svc.rent(input)).rejects.toBeInstanceOf(ConflictError);
  });

  it('rejects when the user already holds the max active rentals (rental.limit)', async () => {
    const repo = fakeRepo({ countActiveByUser: jest.fn(async () => MAX_ACTIVE_RENTALS_PER_USER) });
    const svc = createRentalService(repo, fakeUsers(), fakeBooks());
    await expect(svc.rent(input)).rejects.toBeInstanceOf(ConflictError);
    expect(repo.rent).not.toHaveBeenCalled();
  });

  it('rejects when the user does not exist (rental.user.exists)', async () => {
    const svc = createRentalService(fakeRepo(), fakeUsers(false), fakeBooks());
    await expect(svc.rent(input)).rejects.toBeInstanceOf(NotFoundError);
  });

  it('rejects when the book does not exist (rental.book.exists)', async () => {
    const svc = createRentalService(fakeRepo(), fakeUsers(), fakeBooks(new NotFoundError('book')));
    await expect(svc.rent(input)).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe('rental.return', () => {
  it('returns an active rental and marks the book available (rental.return.effect)', async () => {
    const repo = fakeRepo({ findById: jest.fn(async () => aRental()) });
    const svc = createRentalService(repo, fakeUsers(), fakeBooks());
    const rental = await svc.return('r1');
    expect(repo.return).toHaveBeenCalledWith('r1');
    expect(rental.returnedAt).not.toBeNull();
  });

  it('rejects returning an unknown rental (not_found)', async () => {
    const svc = createRentalService(fakeRepo(), fakeUsers(), fakeBooks());
    await expect(svc.return('nope')).rejects.toBeInstanceOf(NotFoundError);
  });

  it('rejects returning an already-returned rental (rental.return.active)', async () => {
    const repo = fakeRepo({ findById: jest.fn(async () => aRental({ returnedAt: new Date() })) });
    const svc = createRentalService(repo, fakeUsers(), fakeBooks());
    await expect(svc.return('r1')).rejects.toBeInstanceOf(ConflictError);
  });
});

describe('rental.listByUser', () => {
  it('rejects when the user does not exist', async () => {
    const svc = createRentalService(fakeRepo(), fakeUsers(false), fakeBooks());
    await expect(svc.listByUser('u1')).rejects.toBeInstanceOf(NotFoundError);
  });
});
