import { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';

// 404 for unmatched routes — funnels into the error handler.
export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({
    error: { code: 'not_found', message: 'route not found', details: [] },
  });
};

// Central error handler. Maps AppError and ZodError to the contract's JSON
// shape; anything else is an unexpected 500.
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof ZodError) {
    req.log?.warn({ event: 'validation_error', issues: err.issues }, 'invalid request');
    res.status(400).json({
      error: { code: 'validation_error', message: 'invalid request', details: err.issues },
    });
    return;
  }

  if (err instanceof AppError) {
    req.log?.warn({ event: err.code, msg: err.message }, err.message);
    res.status(err.status).json({
      error: { code: err.code, message: err.message, details: err.details },
    });
    return;
  }

  req.log?.error({ event: 'unhandled_error', err }, 'unhandled error');
  res.status(500).json({
    error: { code: 'internal_error', message: 'internal server error', details: [] },
  });
};
