import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Limpeza FK-safe: rentals → books → tags → users
  await prisma.rental.deleteMany();
  await prisma.book.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  // Users
  const alice = await prisma.user.create({ data: { name: 'Alice' } });
  const bob = await prisma.user.create({ data: { name: 'Bob' } });

  // Tags de exemplo
  const tagFiction = await prisma.tag.create({ data: { name: 'Fiction' } });
  const tagSciFi = await prisma.tag.create({ data: { name: 'Sci-Fi' } });
  const tagClassic = await prisma.tag.create({ data: { name: 'Classic' } });
  const tagNonFiction = await prisma.tag.create({ data: { name: 'Non-Fiction' } });

  // Books com tags vinculadas
  await prisma.book.create({
    data: {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      creatorId: alice.id,
      tags: { connect: [{ id: tagNonFiction.id }] },
    },
  });

  await prisma.book.create({
    data: {
      title: 'The Pragmatic Programmer',
      author: 'Hunt & Thomas',
      creatorId: alice.id,
      tags: { connect: [{ id: tagNonFiction.id }] },
    },
  });

  await prisma.book.create({
    data: {
      title: 'Refactoring',
      author: 'Martin Fowler',
      creatorId: bob.id,
      tags: { connect: [{ id: tagNonFiction.id }] },
    },
  });

  await prisma.book.create({
    data: {
      title: 'Dune',
      author: 'Frank Herbert',
      creatorId: bob.id,
      tags: { connect: [{ id: tagFiction.id }, { id: tagSciFi.id }] },
    },
  });

  await prisma.book.create({
    data: {
      title: 'Foundation',
      author: 'Isaac Asimov',
      creatorId: alice.id,
      tags: { connect: [{ id: tagFiction.id }, { id: tagSciFi.id }, { id: tagClassic.id }] },
    },
  });

  // eslint-disable-next-line no-console
  console.log('Seed complete: 2 users, 4 tags (Fiction, Sci-Fi, Classic, Non-Fiction), 5 books with tags.');
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
