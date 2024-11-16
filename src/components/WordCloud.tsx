'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const WordCloud = ({ text }: { text: string }) => {
  const [wordCloudUrl, setWordCloudUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchWordCloud = async () => {
      try {
        const response = await fetch('/api/wordcloud', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }), // Send the text from posts here
        });

        const data = await response.json();
        if (response.ok) {
          setWordCloudUrl(data.image);
        } else {
          console.error('Error generating word cloud');
        }
      } catch (error) {
        console.error('Error fetching word cloud:', error);
      }
    };

    fetchWordCloud();
  }, [text]);

  return (
    <div>
      {wordCloudUrl ? (
        <>
          <Image src={wordCloudUrl} alt="Word Cloud" layout="responsive" width={500} height={500} />
        </>
      ) : (
        <p>Loading word cloud...</p>
      )}
    </div>
  );
};

export default WordCloud;
