'use client';  // Ensure the component runs on the client side in Next.js (client-side rendering)

import { useEffect, useState } from 'react';
import Image from 'next/image'; // Import Image component from Next.js for optimized image loading

// WordCloud component that takes text as a prop and generates a word cloud
const WordCloud = ({ text }: { text: string }) => {
  // State to store the URL of the generated word cloud image
  const [wordCloudUrl, setWordCloudUrl] = useState<string | null>(null);

  // useEffect hook to fetch word cloud whenever the 'text' prop changes
  useEffect(() => {
    const fetchWordCloud = async () => {
      try {
        // Send a POST request to the API route with the text to generate a word cloud
        const response = await fetch('/api/wordcloud', {
          method: 'POST',  // HTTP method is POST
          headers: {
            'Content-Type': 'application/json',  // Specify the content type
          },
          body: JSON.stringify({ text }), // Send the text content as JSON
        });

        // Parse the response from the API
        const data = await response.json();
        
        if (response.ok) {
          // If the response is successful, set the image URL in state
          setWordCloudUrl(data.image);
        } else {
          console.error('Error generating word cloud'); // Handle failure if response is not OK
        }
      } catch (error) {
        console.error('Error fetching word cloud:', error); // Handle errors during the fetch process
      }
    };

    fetchWordCloud(); // Call the function to fetch the word cloud
  }, [text]); // The effect runs whenever the 'text' prop changes

  return (
    <div>
      {wordCloudUrl ? (
        // If the word cloud image URL is available, display the image
        <>
          <Image 
            src={wordCloudUrl} 
            alt="Word Cloud" 
            layout="responsive"  // Image layout will scale responsively
            width={500}           // Set the width of the image
            height={500}          // Set the height of the image
          />
        </>
      ) : (
        // If the word cloud URL isn't available yet, show a loading message
        <p>Loading word cloud...</p>
      )}
    </div>
  );
};

export default WordCloud;  // Export the WordCloud component for use in other parts of the app
