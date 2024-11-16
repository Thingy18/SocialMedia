import { PrismaClient } from '@prisma/client';
import WordCloud from '../components/WordCloud';

const prisma = new PrismaClient();

const HomePage = async () => {
  let postsContent = '';

  try {
    // Fetch the most recent 5 posts from the database
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 5, // Get the most recent 5 posts
    });

    if (posts.length > 0) {
      // Concatenate the content of all posts
      postsContent = posts.map(post => post.content).join(' ');
    } else {
      postsContent = 'No content available';
    }
  } catch (error) {
    console.error('Error fetching content from database:', error);
    postsContent = 'Error fetching content';
  } finally {
    await prisma.$disconnect();
  }

  return (
    <div>
      <h1>Word Cloud Example</h1>
      <WordCloud text={postsContent} />
    </div>
  );
};

export default HomePage;
