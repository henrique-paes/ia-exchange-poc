import { Router } from 'express';
import { userRoutes } from './modules/users/user.routes';
import { bookRoutes } from './modules/books/book.routes';
import { rentalRoutes } from './modules/rentals/rental.routes';

// Aggregates all module routers. app.ts mounts this at the root.
export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

apiRouter.use('/users', userRoutes);
apiRouter.use('/books', bookRoutes);
apiRouter.use('/rentals', rentalRoutes);
