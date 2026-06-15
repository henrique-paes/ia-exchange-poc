import { User } from '@prisma/client';
import { prisma } from '../../prisma';

// Abstraction so the service can be unit-tested with a fake (no DB) and all
// Prisma access for users lives in one place.
export interface UserRepository {
  create(data: { name: string }): Promise<User>;
  findById(id: string): Promise<User | null>;
  list(): Promise<User[]>;
}

export const userRepository: UserRepository = {
  create: (data) => prisma.user.create({ data }),
  findById: (id) => prisma.user.findUnique({ where: { id } }),
  list: () => prisma.user.findMany({ orderBy: { createdAt: 'desc' } }),
};
