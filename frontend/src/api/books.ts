import { api } from './client';
import { Book } from './types';

export const listBooks = () => api.get<Book[]>('/books').then((r) => r.data);

export const createBook = (input: { title: string; author: string; creatorId: string }) =>
  api.post<Book>('/books', input).then((r) => r.data);
