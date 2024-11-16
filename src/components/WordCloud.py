import matplotlib
matplotlib.use('Agg')  # Use the 'Agg' backend to prevent GUI windows
from wordcloud import WordCloud
import matplotlib.pyplot as plt
import sys
import time  # Import time to generate a dynamic random seed

# Get the text passed from Node.js (via command line)
text = sys.argv[1]

# Generate the word cloud with a unique random state
wordcloud = WordCloud(
    width=800,
    height=400,
    background_color="white",
    random_state=int(time.time())  # Use current time as random state
).generate(text)

# Save the word cloud image to a file instead of showing it
wordcloud.to_file('public/wordcloud.png')

# No need to call plt.close() as 'Agg' doesn't use interactive plotting
