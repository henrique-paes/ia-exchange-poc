import { Request, Response } from 'express';
import { createUserSchema } from './user.schema';
import { userService } from './user.service';

export async function createUser(req: Request, res: Response): Promise<void> {
  const input = createUserSchema.parse(req.body);
  const user = await userService.create(input);
  req.log?.info({ event: 'user.create', userId: user.id }, 'user created');
  res.status(201).json(user);
}

export async function getUser(req: Request, res: Response): Promise<void> {
  const user = await userService.getById(req.params.id);
  res.json(user);
}
