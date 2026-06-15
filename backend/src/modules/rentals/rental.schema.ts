import { z } from 'zod';

export const rentBookSchema = z.object({
  userId: z.string().uuid(),
  bookId: z.string().uuid(),
});

export type RentBookInput = z.infer<typeof rentBookSchema>;
