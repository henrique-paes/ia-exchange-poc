import { api } from './client';
import { Book } from './types';

export const listBooks = (tagIds?: string[]) => {
  if (!tagIds || tagIds.length === 0) {
    return api.get<Book[]>('/books').then((r) => r.data);
  }
  // params repetidos: ?tagIds=a&tagIds=b  (AND/match-all semantics — api.md)
  const query = tagIds.map((id) => `tagIds=${encodeURIComponent(id)}`).join('&');
  return api.get<Book[]>(`/books?${query}`).then((r) => r.data);
};

export const createBook = (input: {
  title: string;
  author: string;
  creatorId: string;
  tagIds?: string[];
}) => api.post<Book>('/books', input).then((r) => r.data);

export const updateBook = (
  id: string,
  input: { title?: string; author?: string; tagIds?: string[] },
) => api.patch<Book>(`/books/${id}`, input).then((r) => r.data);
