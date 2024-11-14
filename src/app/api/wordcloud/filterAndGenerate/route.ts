import { spawn } from 'child_process';
import path from 'path';
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const { includeKeywords, excludeKeywords, userFilters } = await request.json();

    // Log filters to check what is being received
    console.log('Received filters:', { includeKeywords, excludeKeywords, userFilters });

    // Build the query to filter posts based on userFilters (e.g., age, gender, region)
    const filterConditions: any = {};

    // Filter conditions should match based on the attribute type and value
    const attributeFilters: any[] = [];

    if (userFilters.age) {
      attributeFilters.push({ type: 'age', value: userFilters.age });
    }

    if (userFilters.gender) {
      attributeFilters.push({ type: 'gender', value: userFilters.gender });
    }

    if (userFilters.region) {
      attributeFilters.push({ type: 'region', value: userFilters.region });
    }

    // Log the attribute filter conditions
    console.log('Attribute filter conditions:', attributeFilters);

    // Fetch posts based on the filters
    const posts = await prisma.post.findMany({
      where: {
        content: {
          // Include posts containing the specified keywords
          contains: includeKeywords && includeKeywords.length > 0 ? includeKeywords.join(' ') : undefined,
          // Exclude posts containing any of the excluded keywords
          not: excludeKeywords && excludeKeywords.length > 0 ? { contains: excludeKeywords.join(' ') } : undefined,
        },
        poster: {
          attributes: {
            some: attributeFilters.length > 0 ? { 
              AND: attributeFilters 
            } : {},
          },
        },
      },
      include: {
        poster: {
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
    const content = posts.map((post) => post.content).join(' ');

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
