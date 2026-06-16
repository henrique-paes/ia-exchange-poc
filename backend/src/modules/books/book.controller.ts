import { Request, Response } from 'express';
import { z } from 'zod';
import { createBookSchema, updateBookSchema } from './book.schema';
import { bookService } from './book.service';

// book.filterByTags — query validation schema
// Normalizes string|string[] from qs; validates each element is a UUID.
// Non-string values (e.g. nested objects from ?tagIds[a]=b) are filtered before
// Zod validation so they produce a clear 400 rather than a silent coercion.
const tagIdsQuerySchema = z
  .array(z.string().uuid())
  .optional();

export async function createBook(req: Request, res: Response): Promise<void> {
  const input = createBookSchema.parse(req.body);
  const book = await bookService.create(input);
  req.log?.info({ event: 'book.create', bookId: book.id }, 'book created');
  res.status(201).json(book);
}

export async function listBooks(req: Request, res: Response): Promise<void> {
  // book.filterByTags — repeated query params: ?tagIds=a&tagIds=b
  // qs can produce string, string[], or nested objects (e.g. ?tagIds[a]=b).
  // Normalize to string[] keeping only string elements, then validate with Zod.
  const raw = req.query.tagIds;
  let coerced: string[] | undefined;
  if (Array.isArray(raw)) {
    // Keep only primitive strings — discard nested objects injected by qs
    coerced = (raw as unknown[]).filter((v): v is string => typeof v === 'string');
  } else if (typeof raw === 'string') {
    coerced = [raw];
  }

  // Validate that every element is a UUID; throws ZodError → 400 if invalid
  const tagIds = tagIdsQuerySchema.parse(coerced);

  const books = await bookService.list(tagIds !== undefined && tagIds.length > 0 ? { tagIds } : undefined);
  res.json(books);
}

export async function getBook(req: Request, res: Response): Promise<void> {
  res.json(await bookService.getById(req.params.id));
}

export async function updateBook(req: Request, res: Response): Promise<void> {
  const input = updateBookSchema.parse(req.body);
  const book = await bookService.update(req.params.id, input);
  req.log?.info({ event: 'book.update', bookId: book.id }, 'book updated');
  res.json(book);
}
