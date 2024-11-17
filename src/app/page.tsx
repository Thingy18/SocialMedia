import { PrismaClient } from '@prisma/client';
import WordCloud from '../components/WordCloud';

const prisma = new PrismaClient();

const HomePage = async () => {
  let postsContent = '';

  try {
    // Fetch all posts from the database
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc', // Order by the created date
      },
    });

    // Concatenate the content of all posts
    if (posts.length > 0) {
      postsContent = posts.map(post => post.content).join(' ');
    } else {
      postsContent = 'No content available';  // Fallback message when there are no posts
    }
  } catch (error) {
    console.error('Error fetching content from database:', error);
    postsContent = 'Error fetching content';  // Fallback in case of an error
  } finally {
    await prisma.$disconnect();  // Ensure the Prisma client is disconnected
  }

  return (
    <div>
      <WordCloud text={postsContent} /> {/* Pass the concatenated post content to WordCloud */}
    </div>
  );
};

export default HomePage;
