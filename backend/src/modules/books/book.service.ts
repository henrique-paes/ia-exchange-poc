import { NotFoundError } from '../../errors/AppError';
import { CreateBookInput, UpdateBookInput } from './book.schema';
import { BookRepository, BookWithTags, bookRepository } from './book.repository';
import { UserService, userService } from '../users/user.service';
import { TagRepository, tagRepository } from '../tags/tag.repository';

// Depends on UserService (book.creator.exists) and TagRepository (book.tags.exists).
export function createBookService(repo: BookRepository, users: UserService, tags: TagRepository) {
  /**
   * Deduplicates tagIds and validates all-or-nothing existence.
   * Returns the deduplicated array.
   * Throws NotFoundError if any id is unknown (book.tags.exists).
   */
  async function validateAndDeduplicateTags(tagIds: string[]): Promise<string[]> {
    const unique = [...new Set(tagIds)]; // book.tags.unique
    if (unique.length === 0) return unique;

    const found = await tags.findManyByIds(unique);
    if (found.length < unique.length) {
      // book.tags.exists — all-or-nothing
      throw new NotFoundError('tag');
    }
    return unique;
  }

  return {
    async create(input: CreateBookInput): Promise<BookWithTags> {
      await users.getById(input.creatorId); // book.creator.exists

      let deduped: string[] | undefined;
      if (input.tagIds !== undefined) {
        deduped = await validateAndDeduplicateTags(input.tagIds); // book.tags.exists + book.tags.unique
      }

      return repo.create({ ...input, tagIds: deduped });
    },

    list(filter?: { tagIds?: string[] }): Promise<BookWithTags[]> {
      return repo.list(filter);
    },

    async getById(id: string): Promise<BookWithTags> {
      const book = await repo.findById(id);
      if (!book) throw new NotFoundError('book');
      return book;
    },

    async update(id: string, input: UpdateBookInput): Promise<BookWithTags> {
      // Verify book exists first
      const existing = await repo.findById(id);
      if (!existing) throw new NotFoundError('book');

      let deduped: string[] | undefined;
      if (input.tagIds !== undefined) {
        deduped = await validateAndDeduplicateTags(input.tagIds); // book.tags.exists + book.tags.unique
      }

      // Only pass tagIds to repo when it was present in input (book.tags.set)
      const updateData: { title?: string; author?: string; tagIds?: string[] } = {};
      if (input.title !== undefined) updateData.title = input.title;
      if (input.author !== undefined) updateData.author = input.author;
      if (deduped !== undefined) updateData.tagIds = deduped;

      return repo.update(id, updateData);
    },
  };
}

export type BookService = ReturnType<typeof createBookService>;

export const bookService = createBookService(bookRepository, userService, tagRepository);
