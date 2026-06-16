import { Request, Response } from 'express';
import { createTagSchema } from './tag.schema';
import { tagService } from './tag.service';

export async function createTag(req: Request, res: Response): Promise<void> {
  const input = createTagSchema.parse(req.body);
  const tag = await tagService.create(input);
  // Log boundary event. name is not PII — safe to include.
  req.log?.info({ event: 'tag.create', tagId: tag.id }, 'tag created');
  res.status(201).json(tag);
}

export async function listTags(_req: Request, res: Response): Promise<void> {
  res.json(await tagService.list());
}

export async function getTag(req: Request, res: Response): Promise<void> {
  res.json(await tagService.getById(req.params.id));
}
