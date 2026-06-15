import { z } from 'zod';

// user.name.required + user.name.length (docs/specs/user.md)
export const createUserSchema = z.object({
  name: z.string().trim().min(2).max(100),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
