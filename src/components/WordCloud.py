from wordcloud import WordCloud
import matplotlib.pyplot as plt
import sys

# Get the text passed from Node.js (via command line)
text = sys.argv[1]

# Generate the word cloud
wordcloud = WordCloud(width=800, height=400, background_color="white").generate(text)

# Save the word cloud image to a file instead of showing it
wordcloud.to_file('public/wordcloud.png')

# Optional: Close any plots to avoid extra windows opening
plt.close()
