// Mirrors the API contract resource shapes (docs/specs/api.md).
export interface User {
  id: string;
  name: string;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  available: boolean;
  creatorId: string;
  createdAt: string;
  tags: Tag[];
}

export interface Rental {
  id: string;
  userId: string;
  bookId: string;
  rentedAt: string;
  returnedAt: string | null;
}
