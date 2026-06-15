import { Rental } from '@prisma/client';
import { ConflictError, NotFoundError } from '../../errors/AppError';
import { UserService, userService } from '../users/user.service';
import { BookService, bookService } from '../books/book.service';
import { RentBookInput } from './rental.schema';
import { RentalRepository, rentalRepository } from './rental.repository';

export const MAX_ACTIVE_RENTALS_PER_USER = 3;

export function createRentalService(
  repo: RentalRepository,
  users: UserService,
  books: BookService,
) {
  return {
    async rent(input: RentBookInput): Promise<Rental> {
      await users.getById(input.userId); // rental.user.exists
      const book = await books.getById(input.bookId); // rental.book.exists

      if (!book.available) {
        throw new ConflictError('book is not available'); // rental.availability
      }
      const active = await repo.countActiveByUser(input.userId);
      if (active >= MAX_ACTIVE_RENTALS_PER_USER) {
        throw new ConflictError('active rental limit reached'); // rental.limit
      }
      return repo.rent(input); // rental.rent.effect
    },

    async return(rentalId: string): Promise<Rental> {
      const rental = await repo.findById(rentalId);
      if (!rental) throw new NotFoundError('rental');
      if (rental.returnedAt) {
        throw new ConflictError('rental already returned'); // rental.return.active
      }
      return repo.return(rentalId); // rental.return.effect
    },

    async listByUser(userId: string): Promise<Rental[]> {
      await users.getById(userId); // 404 when user is unknown
      return repo.listByUser(userId);
    },
  };
}

export type RentalService = ReturnType<typeof createRentalService>;

export const rentalService = createRentalService(rentalRepository, userService, bookService);
