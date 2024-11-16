/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create users first
  const user1 = await prisma.user.create({
    data: {
      attributes: {
        create: [
          { type: 'age', value: '25' },
          { type: 'gender', value: 'Male' },
          { type: 'region', value: 'North America' },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      attributes: {
        create: [
          { type: 'age', value: '30' },
          { type: 'gender', value: 'Female' },
          { type: 'region', value: 'Europe' },
        ],
      },
    },
  });

  const user3 = await prisma.user.create({
    data: {
      attributes: {
        create: [
          { type: 'age', value: '22' },
          { type: 'gender', value: 'Non-Binary' },
          { type: 'region', value: 'Asia' },
        ],
      },
    },
  });

  // Create connections after users are created
  await prisma.connection.createMany({
    data: [
      { userId: user1.id, connectedToId: user2.id, connectionType: 'Friend' },
      { userId: user1.id, connectedToId: user3.id, connectionType: 'Follower' },
      { userId: user2.id, connectedToId: user1.id, connectionType: 'Friend' },
      { userId: user2.id, connectedToId: user3.id, connectionType: 'Follower' },
      { userId: user3.id, connectedToId: user1.id, connectionType: 'Follower' },
      { userId: user3.id, connectedToId: user2.id, connectionType: 'Follower' },
    ],
  });

  // Create posts with sample data, repeating some words to increase frequency
  const post1 = await prisma.post.create({
    data: {
      posterId: user1.id,
      content:
        'Excited to start my new project! Exploring new places is refreshing. Refreshing experiences are always welcome!',
      createdAt: new Date(),
    },
  });

  const post2 = await prisma.post.create({
    data: {
      posterId: user2.id,
      content:
        'Another sample post! Traveling is amazing. Amazing destinations are out there. Traveling lets you explore the world.',
      createdAt: new Date(),
    },
  });

  const post3 = await prisma.post.create({
    data: {
      posterId: user3.id,
      content:
        'Learning new things every day. Education is the key to success. Learning opens new doors.',
      createdAt: new Date(),
    },
  });

  const post4 = await prisma.post.create({
    data: {
      posterId: user1.id,
      content:
        'The sun is shining today. Sunshine is good for the soul. I love sunny days.',
      createdAt: new Date(),
    },
  });

  const post5 = await prisma.post.create({
    data: {
      posterId: user2.id,
      content:
        'Coding is fun! Fun activities help us learn. I enjoy learning new coding techniques.',
      createdAt: new Date(),
    },
  });

  // Create comments on posts
  await prisma.comment.create({
    data: {
      posterId: user1.id,
      postId: post2.id,
      content: 'Nice post!',
      createdAt: new Date(),
    },
  });

  console.log('Seeded default data for all tables.');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
