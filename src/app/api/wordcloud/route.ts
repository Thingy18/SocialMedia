import { spawn } from 'child_process';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Get the text content from the request body
    const { text } = await request.json();

    // Escape the text to avoid issues with special characters
    const safeText = text.replace(/"/g, '\\"');

    // Run the Python script in the background without opening a new tab in IDE
    const pythonProcess = spawn('python', [
      path.join(process.cwd(), 'src/components/WordCloud.py'),
      safeText
    ], {
      detached: true,  // Ensures the process runs independently
      stdio: 'ignore'  // Avoids output to the console
    });

    pythonProcess.unref();  // Detach from the parent process to run independently

    // Return the URL of the generated word cloud image
    return NextResponse.json({ message: 'Word cloud generated', image: '/wordcloud.png' });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ message: 'Error generating word cloud' }, { status: 500 });
  }
}
