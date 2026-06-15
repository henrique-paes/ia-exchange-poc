import axios from 'axios';

// Base API client. Domain calls (users, books, rentals) are added in Phase 3.
const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});
