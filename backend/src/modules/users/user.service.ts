import { User } from '@prisma/client';
import { NotFoundError } from '../../errors/AppError';
import { CreateUserInput } from './user.schema';
import { UserRepository, userRepository } from './user.repository';

// Factory keeps the service decoupled from the concrete repository.
export function createUserService(repo: UserRepository) {
  return {
    create(input: CreateUserInput): Promise<User> {
      return repo.create({ name: input.name });
    },

    async getById(id: string): Promise<User> {
      const user = await repo.findById(id);
      if (!user) throw new NotFoundError('user'); // rental.user.exists / user.getById
      return user;
    },
  };
}

export type UserService = ReturnType<typeof createUserService>;

export const userService = createUserService(userRepository);
