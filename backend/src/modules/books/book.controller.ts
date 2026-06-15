import { Request, Response } from 'express';
import { createBookSchema } from './book.schema';
import { bookService } from './book.service';

export async function createBook(req: Request, res: Response): Promise<void> {
  const input = createBookSchema.parse(req.body);
  const book = await bookService.create(input);
  req.log?.info({ event: 'book.create', bookId: book.id }, 'book created');
  res.status(201).json(book);
}

export async function listBooks(_req: Request, res: Response): Promise<void> {
  res.json(await bookService.list());
}

export async function getBook(req: Request, res: Response): Promise<void> {
  res.json(await bookService.getById(req.params.id));
}
