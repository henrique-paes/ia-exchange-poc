import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { createTag, getTag, listTags } from './tag.controller';

export const tagRoutes = Router();

tagRoutes.post('/', asyncHandler(createTag));
tagRoutes.get('/', asyncHandler(listTags));
tagRoutes.get('/:id', asyncHandler(getTag));
