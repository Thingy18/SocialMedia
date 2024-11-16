import { PrismaClient } from '@prisma/client';
import { spawn } from 'child_process';
import path from 'path';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Get the text content from the request body
    const { text } = await request.json();

    // Fetch posts if no text is provided
    let content = text || '';

    if (!text) {
      const posts = await prisma.post.findMany({
        take: 5, // Ensure you get the most recent posts
        select: {
          content: true,
        },
      });

      // Concatenate content of all posts
      content = posts.map(post => post.content).join(' ');
    }

    // Escape the text to avoid issues with special characters
    const safeText = content.replace(/"/g, '\\"');

    // Run the Python script in the background without opening a new tab in IDE
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
