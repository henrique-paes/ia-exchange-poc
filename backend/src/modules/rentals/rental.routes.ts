import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { rentBook, returnRental } from './rental.controller';

export const rentalRoutes = Router();

rentalRoutes.post('/', asyncHandler(rentBook));
rentalRoutes.post('/:id/return', asyncHandler(returnRental));
