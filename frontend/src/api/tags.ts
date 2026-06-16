import { api } from './client';
import { Tag } from './types';

export const listTags = () => api.get<Tag[]>('/tags').then((r) => r.data);

export const createTag = (name: string) =>
  api.post<Tag>('/tags', { name }).then((r) => r.data);
