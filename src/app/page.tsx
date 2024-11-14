import { useState } from 'react';

export default function HomePage() {
  const [includeKeywords, setIncludeKeywords] = useState('');
  const [excludeKeywords, setExcludeKeywords] = useState('');
  const [userFilters, setUserFilters] = useState({
    age: '',
    gender: '',
    region: '',
  });
  const [wordcloudImage, setWordcloudImage] = useState('');

  const handleGenerateWordCloud = async () => {
    const response = await fetch('/api/wordcloud/filterAndGenerate', {
      method: 'POST',
      body: JSON.stringify({
        includeKeywords: includeKeywords.split(','),
        excludeKeywords: excludeKeywords.split(','),
        userFilters,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();

    if (response.ok) {
      setWordcloudImage(data.image);
    } else {
      alert(data.message);
    }
  };

  return (
    <div>
      <h1>Generate Word Cloud</h1>
      <div>
        <input
          type="text"
          placeholder="Include Keywords"
          value={includeKeywords}
          onChange={(e) => setIncludeKeywords(e.target.value)}
        />
        <input
          type="text"
          placeholder="Exclude Keywords"
          value={excludeKeywords}
          onChange={(e) => setExcludeKeywords(e.target.value)}
        />
        <input
          type="text"
          placeholder="Age"
          value={userFilters.age}
          onChange={(e) => setUserFilters({ ...userFilters, age: e.target.value })}
        />
        <input
          type="text"
          placeholder="Gender"
          value={userFilters.gender}
          onChange={(e) => setUserFilters({ ...userFilters, gender: e.target.value })}
        />
        <input
          type="text"
          placeholder="Region"
          value={userFilters.region}
          onChange={(e) => setUserFilters({ ...userFilters, region: e.target.value })}
        />
        <button onClick={handleGenerateWordCloud}>Generate Word Cloud</button>
      </div>

      {wordcloudImage && <img src={wordcloudImage} alt="Generated Word Cloud" />}
    </div>
  );
}
