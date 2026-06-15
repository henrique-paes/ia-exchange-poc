import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { createUser, getUser, listUsers } from './user.controller';
import { listUserRentals } from '../rentals/rental.controller';

export const userRoutes = Router();

userRoutes.post('/', asyncHandler(createUser));
userRoutes.get('/', asyncHandler(listUsers));
userRoutes.get('/:id', asyncHandler(getUser));
// rental.listByUser — lives under /users per the API contract
userRoutes.get('/:id/rentals', asyncHandler(listUserRentals));
