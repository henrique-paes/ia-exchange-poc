import { Tag } from '@prisma/client';
import { prisma } from '../../prisma';

export interface TagRepository {
  create(data: { name: string }): Promise<Tag>;
  findById(id: string): Promise<Tag | null>;
  list(): Promise<Tag[]>;
  findByNameInsensitive(name: string): Promise<Tag | null>;
  findManyByIds(ids: string[]): Promise<Tag[]>;
}

export const tagRepository: TagRepository = {
  create: (data) => prisma.tag.create({ data }),
  findById: (id) => prisma.tag.findUnique({ where: { id } }),
  list: () => prisma.tag.findMany({ orderBy: { name: 'asc' } }),
  findByNameInsensitive: (name) =>
    prisma.tag.findFirst({ where: { name: { equals: name, mode: 'insensitive' } } }),
  findManyByIds: (ids) => prisma.tag.findMany({ where: { id: { in: ids } } }),
};
