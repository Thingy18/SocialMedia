import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create users first
  const user1 = await prisma.user.create({
    data: {
      attributes: {
        create: [
          { type: 'age', value: '25' },
          { type: 'gender', value: 'Male' },
          { type: 'region', value: 'North America' },
        ]
      }
    }
  })

  const user2 = await prisma.user.create({
    data: {
      attributes: {
        create: [
          { type: 'age', value: '30' },
          { type: 'gender', value: 'Female' },
          { type: 'region', value: 'Europe' },
        ]
      }
    }
  })

  const user3 = await prisma.user.create({
    data: {
      attributes: {
        create: [
          { type: 'age', value: '22' },
          { type: 'gender', value: 'Non-Binary' },
          { type: 'region', value: 'Asia' },
        ]
      }
    }
  })

  // Create connections after users are created
  await prisma.connection.createMany({
    data: [
      { userId: user1.id, connectedToId: user2.id, connectionType: 'Friend' },
      { userId: user1.id, connectedToId: user3.id, connectionType: 'Follower' },
      { userId: user2.id, connectedToId: user1.id, connectionType: 'Friend' },
      { userId: user2.id, connectedToId: user3.id, connectionType: 'Follower' },
      { userId: user3.id, connectedToId: user1.id, connectionType: 'Follower' },
      { userId: user3.id, connectedToId: user2.id, connectionType: 'Follower' }
    ]
  })

  // Create posts with sample data
  const post1 = await prisma.post.create({
    data: {
      posterId: user1.id,
      content: 'This is a sample post content.',
      createdAt: new Date()
    }
  })

  const post2 = await prisma.post.create({
    data: {
      posterId: user2.id,
      content: 'Another sample post!',
      createdAt: new Date()
    }
  })

  // Create comments on posts
  await prisma.comment.create({
    data: {
      posterId: user1.id,
      postId: post2.id,
      content: 'Nice post!',
      createdAt: new Date()
    }
  })

  console.log('Seeded default data for all tables.')
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
