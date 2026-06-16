import express, { Express } from 'express';
import cors from 'cors';
import { config } from './config';
import { httpLogger } from './middleware/httpLogger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { apiRouter } from './routes';

// App factory. Order matters: logger → cors → json → routes → 404 → error handler.
export function createApp(): Express {
  const app = express();

  app.use(httpLogger);
  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json());

  app.use('/', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
