import requests
import json
import pandas as pd
import regex as re
from bs4 import BeautifulSoup as soup

# set start url
base_url = 'https://www.foxnews.com/shows'

# set headers for requests
req_headers = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.8',
    'x-requested-with': 'XMLHttpRequest',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
}

transcript_links = []

# get html of fox news page and parse
page_html = requests.get(url = base_url, headers = req_headers).content
page_soup = soup(page_html, 'html.parser')

# find link to transcripts in show elements
for show in page_soup.findAll('li', {'class':'showpage'}) :
    for link in show.findAll('a'):
        if re.search('transcript$', link['href']) != None:
            transcript_links.append(link['href'])

# initialize dictionary for data storage
cols = ['title', 'link', 'show', 'date']
outputData = {k: [] for k in cols}

# iterate through list of shows
for link in transcript_links:

    # set query params
    url = 'https://www.foxnews.com/api/article-search'
    search = re.sub('^/[^/]+/', 'fox-news/', link)

    # extract show name from link
    show_d = re.sub('.+(/[^/]+)/.+$', '\\1', link)
    show = show_d.replace('/','').replace('-',' ').title()

    print(f'Scraping from {show}...')

    # set query- iterate through to avoid size limits
    for offset in range(0,5020,20):

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
pd.DataFrame.from_dict(outputData).to_csv('data/foxnews.csv', index = False)