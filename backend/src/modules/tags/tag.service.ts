import { Tag } from '@prisma/client';
import { ConflictError, NotFoundError } from '../../errors/AppError';
import { CreateTagInput } from './tag.schema';
import { TagRepository, tagRepository } from './tag.repository';

// createTagService follows the same factory pattern as book.service.ts to
// allow dependency injection in unit tests (fake repos).
export function createTagService(repo: TagRepository) {
  return {
    async create(input: CreateTagInput): Promise<Tag> {
      const existing = await repo.findByNameInsensitive(input.name);
      if (existing) throw new ConflictError('tag name already exists');
      return repo.create({ name: input.name });
    },

    list(): Promise<Tag[]> {
      return repo.list();
    },

    async getById(id: string): Promise<Tag> {
      const tag = await repo.findById(id);
      if (!tag) throw new NotFoundError('tag');
      return tag;
    },
  };
}

export type TagService = ReturnType<typeof createTagService>;

export const tagService = createTagService(tagRepository);
