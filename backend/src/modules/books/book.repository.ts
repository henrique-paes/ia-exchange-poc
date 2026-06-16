import { Book, Tag } from '@prisma/client';
import { prisma } from '../../prisma';

export type BookWithTags = Book & { tags: Tag[] };

export interface BookRepository {
  create(data: { title: string; author: string; creatorId: string; tagIds?: string[] }): Promise<BookWithTags>;
  findById(id: string): Promise<BookWithTags | null>;
  // book.filterByTags — AND/match-all when tagIds provided (docs/specs/tag.md §book.filterByTags)
  list(filter?: { tagIds?: string[] }): Promise<BookWithTags[]>;
  // book.tags.set — tagIds replaces the full set when present (docs/specs/tag.md §book.tags.set)
  update(
    id: string,
    data: { title?: string; author?: string; tagIds?: string[] },
  ): Promise<BookWithTags>;
}

export const bookRepository: BookRepository = {
  create: (data) => {
    const { tagIds, ...rest } = data;
    return prisma.book.create({
      data: {
        ...rest,
        ...(tagIds !== undefined && tagIds.length > 0
          ? { tags: { connect: tagIds.map((id) => ({ id })) } }
          : {}),
      },
      include: { tags: true },
    });
  },

  findById: (id) =>
    prisma.book.findUnique({
      where: { id },
      include: { tags: true },
    }),

  list: (filter) => {
    // book.filterByTags — AND/match-all: each tag produces one `some` subquery.
    // N tagIds → N subqueries joined with AND. For large N this can be expensive;
    // the cardinality of tagIds should be capped (e.g. max 10) in a future release.
    const where =
      filter?.tagIds && filter.tagIds.length > 0
        ? {
            AND: filter.tagIds.map((id) => ({ tags: { some: { id } } })),
          }
        : undefined;

    return prisma.book.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { tags: true },
    });
  },

  update: (id, data) => {
    const { tagIds, ...rest } = data;
    return prisma.book.update({
      where: { id },
      data: {
        ...rest,
        ...(tagIds !== undefined
          ? { tags: { set: tagIds.map((tid) => ({ id: tid })) } }
          : {}),
      },
      include: { tags: true },
    });
  },
};
