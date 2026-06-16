import { prisma } from '../../src/prisma';

// Integration tests run against the dev Postgres. Reset rows between tests
// (children first to respect FKs). NOTE: this clears seed data — run
// `npm run seed` afterwards to restore samples.
export async function resetDb(): Promise<void> {
  await prisma.rental.deleteMany();
  await prisma.book.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();
}

export { prisma };
