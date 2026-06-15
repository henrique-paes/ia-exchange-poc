import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { createBook, getBook, listBooks } from './book.controller';

export const bookRoutes = Router();

bookRoutes.post('/', asyncHandler(createBook));
bookRoutes.get('/', asyncHandler(listBooks));
bookRoutes.get('/:id', asyncHandler(getBook));
