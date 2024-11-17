import { PrismaClient } from '@prisma/client';
import { spawn } from 'child_process';
import path from 'path';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Get the text content and filters from the request body
    const { includeKeywords, excludeKeywords, attributes } = await request.json();

    // Prepare the base query for fetching posts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const postsQuery: any = {
      select: { content: true, poster: { select: { attributes: true } } },
      where: {}
    };

    // Apply filters for includeKeywords
    if (includeKeywords && includeKeywords.length > 0) {
      postsQuery.where.content = {
        contains: includeKeywords.join(' '),  // Post must contain at least one of the include keywords
      };
    }

    // Apply filters for excludeKeywords
    if (excludeKeywords && excludeKeywords.length > 0) {
      postsQuery.where.content = {
        ...postsQuery.where.content,
        not: { contains: excludeKeywords.join(' ') },  // Post must not contain any of the exclude keywords
      };
    }

    // Apply user attributes filtering
    if (attributes && attributes.length > 0) {
      postsQuery.where.poster = {
        attributes: {
          some: {
            type: { in: attributes.map(attr => attr.type) }, // Match attributes like age, gender, etc.
            value: { in: attributes.map(attr => attr.value) }, // Filter by specific values for each attribute
          },
        },
      };
    }

    // Fetch posts based on the query
    const posts = await prisma.post.findMany(postsQuery);

    if (!posts.length) {
      return NextResponse.json({ message: 'No posts found matching the criteria' }, { status: 404 });
    }

    // Concatenate content of all posts
    const content = posts.map(post => post.content).join(' ');

    // Escape the text to avoid issues with special characters
    const safeText = content.replace(/"/g, '\\"');

    // Run the Python script to generate the word cloud
    const pythonProcess = spawn('pythonw', [
      path.join(process.cwd(), 'src/components/WordCloud.py'),
      safeText,
    ], {
      detached: true,
      stdio: 'ignore',
    });

    pythonProcess.unref();

    return NextResponse.json({ message: 'Word cloud generated', image: '/wordcloud.png' });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ message: 'Error generating word cloud' }, { status: 500 });
  }
}
