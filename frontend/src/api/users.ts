import { api } from './client';
import { Rental, User } from './types';

export const listUsers = () => api.get<User[]>('/users').then((r) => r.data);

export const createUser = (name: string) =>
  api.post<User>('/users', { name }).then((r) => r.data);

export const listUserRentals = (userId: string) =>
  api.get<Rental[]>(`/users/${userId}/rentals`).then((r) => r.data);
