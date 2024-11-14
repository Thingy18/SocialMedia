import { spawn } from 'child_process';
import path from 'path';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';  // Adjust the path to the correct location

export async function POST(request: Request) {
  try {
    const { includeKeywords, excludeKeywords, userFilters } = await request.json();

    // Build the query to filter posts based on userFilters (e.g., age, gender, region)
    const filterConditions: any = {};

    if (userFilters.age) {
      filterConditions.attributes = {
        age: userFilters.age,
      };
    }

    if (userFilters.gender) {
      filterConditions.attributes = {
        ...filterConditions.attributes,
        gender: userFilters.gender,
      };
    }

    if (userFilters.region) {
      filterConditions.attributes = {
        ...filterConditions.attributes,
        region: userFilters.region,
      };
    }

    // Fetch posts based on the filters
    const posts = await prisma.post.findMany({
      where: {
        content: {
          // Include posts containing the specified keywords
          contains: includeKeywords.join(' '),
          // Exclude posts containing any of the excluded keywords
          not: {
            contains: excludeKeywords.join(' '),
          },
        },
        user: {
          attributes: filterConditions.attributes ? filterConditions.attributes : {},
        },
      },
      include: {
        user: {
          include: {
            attributes: true,
          },
        },
      },
    });

    // If no posts are found after filtering, return a message
    if (posts.length === 0) {
      return NextResponse.json({ message: 'No posts match the filter criteria.' }, { status: 404 });
    }

    // Prepare the filtered posts content for word cloud generation
    const content = posts.map(post => post.content).join(' ');

    // Run the Python script to generate the word cloud
    const pythonProcess = spawn('python', [
      path.join(process.cwd(), 'src/components/WordCloud.py'),
      content,  // Pass the filtered posts' content to the Python script
    ], {
      detached: true,
      stdio: 'ignore',
    });

    pythonProcess.unref();

    return NextResponse.json({ message: 'Word cloud generated', image: '/wordcloud.png' });
  } catch (error) {
    console.error('Error generating word cloud:', error);
    return NextResponse.json({ message: 'Error generating word cloud' }, { status: 500 });
  }
}
