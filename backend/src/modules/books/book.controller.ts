import { Request, Response } from 'express';
import { createBookSchema, updateBookSchema } from './book.schema';
import { bookService } from './book.service';

export async function createBook(req: Request, res: Response): Promise<void> {
  const input = createBookSchema.parse(req.body);
  const book = await bookService.create(input);
  req.log?.info({ event: 'book.create', bookId: book.id }, 'book created');
  res.status(201).json(book);
}

export async function listBooks(req: Request, res: Response): Promise<void> {
  // book.filterByTags — repeated query params: ?tagIds=a&tagIds=b
  // req.query.tagIds can be a string, string[], or undefined depending on query shape
  const raw = req.query.tagIds;
  let tagIds: string[] | undefined;
  if (Array.isArray(raw)) {
    tagIds = raw as string[];
  } else if (typeof raw === 'string') {
    tagIds = [raw];
  }

  const books = await bookService.list(tagIds !== undefined ? { tagIds } : undefined);
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
