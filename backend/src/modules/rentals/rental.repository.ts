import { Rental } from '@prisma/client';
import { prisma } from '../../prisma';

export interface RentalRepository {
  // rent.effect: create active rental + mark book unavailable (atomic)
  rent(data: { userId: string; bookId: string }): Promise<Rental>;
  // return.effect: set returnedAt + mark book available (atomic)
  return(rentalId: string): Promise<Rental>;
  findById(id: string): Promise<Rental | null>;
  countActiveByUser(userId: string): Promise<number>;
  listByUser(userId: string): Promise<Rental[]>;
}

export const rentalRepository: RentalRepository = {
  rent: ({ userId, bookId }) =>
    prisma.$transaction(async (tx) => {
      const rental = await tx.rental.create({ data: { userId, bookId } });
      await tx.book.update({ where: { id: bookId }, data: { available: false } });
      return rental;
    }),

  return: (rentalId) =>
    prisma.$transaction(async (tx) => {
      const rental = await tx.rental.update({
        where: { id: rentalId },
        data: { returnedAt: new Date() },
      });
      await tx.book.update({ where: { id: rental.bookId }, data: { available: true } });
      return rental;
    }),

  findById: (id) => prisma.rental.findUnique({ where: { id } }),
  countActiveByUser: (userId) =>
    prisma.rental.count({ where: { userId, returnedAt: null } }),
  listByUser: (userId) =>
    prisma.rental.findMany({ where: { userId }, orderBy: { rentedAt: 'desc' } }),
};
