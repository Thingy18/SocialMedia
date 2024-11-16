'use client';

import { useEffect, useState } from 'react';

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
          body: JSON.stringify({ text }),
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
        <img src={wordCloudUrl} alt="Word Cloud" style={{ width: '100%', height: 'auto' }} />
      ) : (
        <p>Loading word cloud...</p>
      )}
    </div>
  );
};

export default WordCloud;
