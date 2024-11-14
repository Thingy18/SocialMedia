import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create default users with attributes
  const user1 = await prisma.user.create({
    data: {
      attributes: {
        create: [
          { type: 'Skill', value: 'JavaScript' },
          { type: 'Interest', value: 'Photography' },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      attributes: {
        create: [
          { type: 'Skill', value: 'Python' },
          { type: 'Interest', value: 'Traveling' },
        ],
      },
    },
  });

  const user3 = await prisma.user.create({
    data: {
      attributes: {
        create: [
          { type: 'Skill', value: 'Design' },
          { type: 'Interest', value: 'Art' },
        ],
      },
    },
  });

  // Create default connections between users
  await prisma.connection.createMany({
    data: [
      { userId: user1.id, connectedToId: user2.id, connectionType: 'friend' },
      { userId: user2.id, connectedToId: user3.id, connectionType: 'colleague' },
      { userId: user1.id, connectedToId: user3.id, connectionType: 'follower' },
    ],
  });

  // Create default posts with comments and viewers
  const post1 = await prisma.post.create({
    data: {
      posterId: user1.id,
      content: 'Excited to start my new project!',
      comments: {
        create: [
          {
            posterId: user2.id,
            content: 'Good luck with your project!',
          },
          {
            posterId: user3.id,
            content: 'Looking forward to seeing it!',
          },
        ],
      },
    },
  });

  const post2 = await prisma.post.create({
    data: {
      posterId: user2.id,
      content: 'Exploring new places is so refreshing!',
      comments: {
        create: [
          {
            posterId: user1.id,
            content: 'I love traveling too!',
          },
        ],
      },
    },
  });

  // Mark posts as read by users (many-to-many using ReadPost)
  await prisma.readPost.createMany({
    data: [
      { userId: user1.id, postId: post2.id }, // user1 has read post2
      { userId: user3.id, postId: post1.id }, // user3 has read post1
    ],
  });

  console.log('Database seeded successfully with default data');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
