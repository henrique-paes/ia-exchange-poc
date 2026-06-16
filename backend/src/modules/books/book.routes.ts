import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { createBook, getBook, listBooks, updateBook } from './book.controller';

export const bookRoutes = Router();

bookRoutes.post('/', asyncHandler(createBook));
bookRoutes.get('/', asyncHandler(listBooks));
bookRoutes.get('/:id', asyncHandler(getBook));
bookRoutes.patch('/:id', asyncHandler(updateBook));
