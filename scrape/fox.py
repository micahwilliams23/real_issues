import requests
import json
import regex as re
from bs4 import BeautifulSoup as soup

# url = 'https://www.foxnews.com/api/article-search?isCategory=true&searchSelected=fox-news%2Ftranscript&size=20&offset=0'
base_url = 'https://www.foxnews.com/shows'

req_headers = {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.8',
        'x-requested-with': 'XMLHttpRequest',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
}

cols = ['title', 'link', 'show', 'date']

transcript_links = []

page_html = requests.get(url = base_url, headers = req_headers).content
page_soup = soup(page_html, 'html.parser')

for show in page_soup.findAll('li', {'class':'showpage'}) :
    for link in show.findAll('a'):
        if re.search('transcript$', link['href']) != None:
            transcript_links.append(link['href'])

for link in transcript_links:

    requests.get()