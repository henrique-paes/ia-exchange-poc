import { z } from 'zod';

// tag.name.required / tag.name.length (docs/specs/tag.md).
export const createTagSchema = z.object({
  name: z.string().trim().min(1).max(40),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;
