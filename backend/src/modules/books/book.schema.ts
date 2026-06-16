import { z } from 'zod';

// book.title.required / book.author.required (docs/specs/book.md).
// `available` is server-managed and never accepted from the client.
export const createBookSchema = z.object({
  title: z.string().trim().min(1).max(200),
  author: z.string().trim().min(1).max(120),
  creatorId: z.string().uuid(),
  // book.tags.optional — tagIds is optional on create (docs/specs/tag.md §book.tags.optional)
  tagIds: z.array(z.string().uuid()).optional(),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;

// book.update.noFields — at least one field must be present (docs/specs/book.md §book.update.noFields)
export const updateBookSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    author: z.string().trim().min(1).max(120).optional(),
    // book.tags.optional — omitting tagIds preserves existing; [] clears all tags
    tagIds: z.array(z.string().uuid()).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'at least one field must be provided',
  });

export type UpdateBookInput = z.infer<typeof updateBookSchema>;
