import { Book } from '@prisma/client';
import { NotFoundError } from '../../errors/AppError';
import { CreateBookInput } from './book.schema';
import { BookRepository, bookRepository } from './book.repository';
import { UserService, userService } from '../users/user.service';

// Depends on UserService to enforce book.creator.exists without duplicating
// the user-lookup logic.
export function createBookService(repo: BookRepository, users: UserService) {
  return {
    async create(input: CreateBookInput): Promise<Book> {
      await users.getById(input.creatorId); // book.creator.exists (throws 404)
      return repo.create(input);
    },

    list(): Promise<Book[]> {
      return repo.list();
    },

    async getById(id: string): Promise<Book> {
      const book = await repo.findById(id);
      if (!book) throw new NotFoundError('book');
      return book;
    },
  };
}

export type BookService = ReturnType<typeof createBookService>;

export const bookService = createBookService(bookRepository, userService);
