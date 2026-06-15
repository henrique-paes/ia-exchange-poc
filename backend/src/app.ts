import express, { Express } from 'express';

// App factory. Routes for domains (users, books, rentals) get mounted here
// in Phase 2 as each card is implemented.
export function createApp(): Express {
  const app = express();

  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  return app;
}
