import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.user.create({ data: { name: 'Alice' } });
  const bob = await prisma.user.create({ data: { name: 'Bob' } });

  await prisma.book.createMany({
    data: [
      { title: 'Clean Code', author: 'Robert C. Martin', creatorId: alice.id },
      { title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', creatorId: alice.id },
      { title: 'Refactoring', author: 'Martin Fowler', creatorId: bob.id },
    ],
  });

  // eslint-disable-next-line no-console
  console.log('Seed complete: 2 users, 3 books.');
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
