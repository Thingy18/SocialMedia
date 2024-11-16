'use client'; // Marks this file as a client-side component

import { useState, useEffect } from 'react';
import { prisma } from '../lib/prisma';

export default function HomePage() {
  // State to manage keywords and user attributes
  const [includeKeywords, setIncludeKeywords] = useState('');
  const [excludeKeywords, setExcludeKeywords] = useState('');
  const [userAttributes, setUserAttributes] = useState({ age: '', gender: '', region: '' });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch posts based on the filters
  const fetchFilteredPosts = async () => {
    setLoading(true);

    try {
      const filteredPosts = await prisma.post.findMany({
        where: {
          content: {
            contains: includeKeywords,
            not: {
              contains: excludeKeywords,
            },
          },
          poster: {
            attributes: {
              some: {
                AND: [
                  userAttributes.age ? { value: userAttributes.age } : {},
                  userAttributes.gender ? { value: userAttributes.gender } : {},
                  userAttributes.region ? { value: userAttributes.region } : {},
                ],
              },
            },
          },
        },
        include: {
          poster: true, // Include the associated user (poster) details
        },
      });

      setPosts(filteredPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredPosts();
  }, [includeKeywords, excludeKeywords, userAttributes]); // Refetch when filters change

  return (
    <div>
      <h1>Social Media Posts</h1>

      {/* Input to include keywords */}
      <div>
        <label>Include Keywords</label>
        <input
          type="text"
          value={includeKeywords}
          onChange={(e) => setIncludeKeywords(e.target.value)}
          placeholder="Enter keywords to include"
        />
      </div>

      {/* Input to exclude keywords */}
      <div>
        <label>Exclude Keywords</label>
        <input
          type="text"
          value={excludeKeywords}
          onChange={(e) => setExcludeKeywords(e.target.value)}
          placeholder="Enter keywords to exclude"
        />
      </div>

      {/* Inputs for filtering by user attributes */}
      <div>
        <label>Age</label>
        <input
          type="text"
          value={userAttributes.age}
          onChange={(e) => setUserAttributes({ ...userAttributes, age: e.target.value })}
          placeholder="Enter age"
        />
      </div>

      <div>
        <label>Gender</label>
        <input
          type="text"
          value={userAttributes.gender}
          onChange={(e) => setUserAttributes({ ...userAttributes, gender: e.target.value })}
          placeholder="Enter gender"
        />
      </div>

      <div>
        <label>Region</label>
        <input
          type="text"
          value={userAttributes.region}
          onChange={(e) => setUserAttributes({ ...userAttributes, region: e.target.value })}
          placeholder="Enter region"
        />
      </div>

      {/* Button to trigger the fetching of posts */}
      <div>
        <button onClick={fetchFilteredPosts} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Posts'}
        </button>
      </div>

      {/* Display posts */}
      <div>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id}>
              <h3>{post.content}</h3>
              <p>Posted by: {post.poster.name}</p>
            </div>
          ))
        ) : (
          <p>No posts found with the given filters.</p>
        )}
      </div>
    </div>
  );
}
