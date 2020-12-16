import requests
import json
import pandas as pd
from bs4 import BeautifulSoup as soup

# set headers for requests
req_headers = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.8',
    'x-requested-with': 'XMLHttpRequest',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
}

# initialize dictionary for data storage
cols = ['title', 'link', 'show', 'date']
outputData = {k: [] for k in cols}

# set query params
url = 'https://www.foxnews.com/api/article-search'
search = 'fox-news/shows/tucker-carlson-tonight/transcript'
show = 'Tucker Carlson Tonight'

print(f'Scraping from {show}...')

# set query- iterate through to avoid size limits
for offset in range(0,10020,20):

    query = {
        'isTag': 'true',
        'searchSelected': search,
        'size': '20',
        'offset': str(offset)
    }
    
    # send AJAX requests for data
    response = requests.get(url = url, headers = req_headers, params=query).json()

    # break loop if page sends no data back
    if len(response) == 0: 
        break

    # iterate through transcripts
    for ts in response:
        # append data to dictionary
        outputData['title'].append(ts['title'])
        outputData['link'].append(ts['url'])
        outputData['show'].append(show)
        outputData['date'].append(ts['publicationDate'])

# write data to csv with pandas
pd.DataFrame.from_dict(outputData).to_csv('data/tucker.csv', index = False)