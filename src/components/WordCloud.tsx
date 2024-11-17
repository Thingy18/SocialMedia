'use client';

import { useState } from 'react';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';

const WordCloud = ({ text }: { text: string }) => {
  const [wordCloudUrl, setWordCloudUrl] = useState<string | null>(null);
  //Gets the filters from the user input
  const [includeKeywords, setIncludeKeywords] = useState<string[]>([]);
  const [excludeKeywords, setExcludeKeywords] = useState<string[]>([]);
  const [attributes, setAttributes] = useState<{ type: string; value: string }[]>([]);
  //Parses the attributes from the user input
  const parseAttributes = (input: string) => {
    const parsedAttributes = input.split(',').map((item) => {
      const [type, value] = item.split(':').map((str) => str.trim());
      return { type, value };
    });
    setAttributes(parsedAttributes);
  };
  //Calls the API to generate the word cloud which in turn calls the python script
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
        setWordCloudUrl(data.image);
      } else {
        console.error('Error generating word cloud');
      }
    } catch (error) {
      console.error('Error fetching word cloud:', error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {/* Input Fields */}
          <div className="mb-3">
            <label htmlFor="includeKeywords" className="form-label">
              Include Keywords
            </label>
            <input
              type="text"
              id="includeKeywords"
              placeholder="Comma-separated keywords to include"
              className="form-control"
              onChange={(e) => setIncludeKeywords(e.target.value.split(',').map((keyword) => keyword.trim()))}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="excludeKeywords" className="form-label">
              Exclude Keywords
            </label>
            <input
              type="text"
              id="excludeKeywords"
              placeholder="Comma-separated keywords to exclude"
              className="form-control"
              onChange={(e) => setExcludeKeywords(e.target.value.split(',').map((keyword) => keyword.trim()))}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="attributes" className="form-label">
              User Attributes
            </label>
            <input
              type="text"
              id="attributes"
              placeholder="e.g., age:25, gender:Male"
              className="form-control"
              onChange={(e) => parseAttributes(e.target.value)}
            />
          </div>

          {/* Button */}
          <button onClick={fetchWordCloud} className="btn btn-primary w-100">
            Generate Word Cloud
          </button>

          {/* Word Cloud Display */}
          {wordCloudUrl ? (
            <div className="mt-4 text-center">
              <Image src={wordCloudUrl} alt="Word Cloud" width={500} height={500} />
            </div>
          ) : (
            <p className="mt-4 text-center">Loading word cloud...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordCloud;
