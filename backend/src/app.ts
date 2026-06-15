import express, { Express } from 'express';
import { httpLogger } from './middleware/httpLogger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { apiRouter } from './routes';

// App factory. Order matters: logger → json → routes → 404 → error handler.
export function createApp(): Express {
  const app = express();

  app.use(httpLogger);
  app.use(express.json());

  app.use('/', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
