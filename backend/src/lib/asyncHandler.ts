import { RequestHandler } from 'express';

// Express 4 doesn't forward async rejections to the error handler.
// Wrap async controllers so thrown/rejected errors reach errorHandler.
export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
