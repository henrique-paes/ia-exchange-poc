import { Book } from '@prisma/client';
import { prisma } from '../../prisma';

export interface BookRepository {
  create(data: { title: string; author: string; creatorId: string }): Promise<Book>;
  findById(id: string): Promise<Book | null>;
  list(): Promise<Book[]>;
}

export const bookRepository: BookRepository = {
  create: (data) => prisma.book.create({ data }),
  findById: (id) => prisma.book.findUnique({ where: { id } }),
  list: () => prisma.book.findMany({ orderBy: { createdAt: 'desc' } }),
};
