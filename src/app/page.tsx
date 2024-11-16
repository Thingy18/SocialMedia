import WordCloud from '../components/WordCloud';

const HomePage = () => {
  const postsContent = "Excited to start my new project! Exploring new places is so refreshing!"; // Example posts content

  return (
    <div>
      <h1>Word Cloud Example</h1>
      <WordCloud text={postsContent} />
    </div>
  );
};

export default HomePage;
