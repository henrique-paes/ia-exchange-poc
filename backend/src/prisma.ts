import { PrismaClient } from '@prisma/client';

// Single PrismaClient for the process. Importing this everywhere avoids
// opening a new connection pool per module.
export const prisma = new PrismaClient();
