import { z } from 'zod';

// book.title.required / book.author.required (docs/specs/book.md).
// `available` is server-managed and never accepted from the client.
export const createBookSchema = z.object({
  title: z.string().trim().min(1).max(200),
  author: z.string().trim().min(1).max(120),
  creatorId: z.string().uuid(),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;
