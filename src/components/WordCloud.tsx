'use client';  // Ensure this component is treated as a client-side component

import { useEffect, useState } from 'react';
import Image from 'next/image';

const WordCloud = ({ text }: { text: string }) => {
  const [wordCloudUrl, setWordCloudUrl] = useState<string | null>(null);
  const [includeKeywords, setIncludeKeywords] = useState<string[]>([]);
  const [excludeKeywords, setExcludeKeywords] = useState<string[]>([]);
  const [attributes, setAttributes] = useState<{ type: string, value: string }[]>([]);

  // Function to parse attribute input (e.g., "age:25, gender:Male")
  const parseAttributes = (input: string) => {
    const parsedAttributes = input.split(',').map((item) => {
      const [type, value] = item.split(':').map((str) => str.trim());
      return { type, value };
    });
    setAttributes(parsedAttributes);
  };

  // Function to fetch the word cloud when the button is clicked
  const fetchWordCloud = async () => {
    try {
      const response = await fetch('/api/wordcloud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          includeKeywords,
          excludeKeywords,
          attributes,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setWordCloudUrl(data.image); // Set the URL of the word cloud image
      } else {
        console.error('Error generating word cloud');
      }
    } catch (error) {
      console.error('Error fetching word cloud:', error);
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Include keywords (comma separated)"
          onChange={(e) => setIncludeKeywords(e.target.value.split(',').map(keyword => keyword.trim()))}
        />
        <input
          type="text"
          placeholder="Exclude keywords (comma separated)"
          onChange={(e) => setExcludeKeywords(e.target.value.split(',').map(keyword => keyword.trim()))}
        />
        <input
          type="text"
          placeholder="User attributes (e.g., age:25, gender:Male)"
          onChange={(e) => parseAttributes(e.target.value)}
        />
      </div>

      {/* Button to trigger fetching of the word cloud */}
      <button onClick={fetchWordCloud}>Generate Word Cloud</button>

      {wordCloudUrl ? (
        <Image src={wordCloudUrl} alt="Word Cloud" width={500} height={500} />
      ) : (
        <p>Loading word cloud...</p>
      )}
    </div>
  );
};

export default WordCloud;
