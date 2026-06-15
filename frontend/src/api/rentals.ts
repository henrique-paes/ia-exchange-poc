import { api } from './client';
import { Rental } from './types';

export const rentBook = (userId: string, bookId: string) =>
  api.post<Rental>('/rentals', { userId, bookId }).then((r) => r.data);

export const returnRental = (rentalId: string) =>
  api.post<Rental>(`/rentals/${rentalId}/return`).then((r) => r.data);
