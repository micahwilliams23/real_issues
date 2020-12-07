from bs4 import BeautifulSoup as soup
import requests
import regex as re
import csv

# webpage urls
base_url = 'http://transcripts.cnn.com'
url = 'http://transcripts.cnn.com/TRANSCRIPTS/'

# add headers to request
req_headers = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.8',
    'x-requested-with': 'XMLHttpRequest',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
}

# open csv and write column names
with open('data/cnn_links.csv', 'w', newline='') as f:
    csv.writer(f).writerow(['show', 'title', 'href'])

# get and parse webpage with BeautifulSoup
page_html = requests.get(url=url, headers=req_headers).content
page_soup = soup(page_html, 'html.parser')

# find links to show
link_table = page_soup.find('table', {'id': 'cnn_categorytable'})
show_links = link_table.findAll('a')

# iterate through show links
for show_link in show_links:

    show = show_link.text

    # get and parse webpage with BeautifulSoup
    page_html = requests.get(url=base_url + show_link['href'], headers=req_headers).content
    page_soup = soup(page_html, 'html.parser')

    # find all div elements (contain links)
    link_divs = page_soup.findAll('div', {'class': 'cnnSectBulletItems'})

    # iterate through div elements
    for div in link_divs:

        # find link elements
        t_links = div.findAll('a')

        # iterate through link elements
        for link in t_links:

            # extract title and href from link element
            href = link['href']
            title = link.text

            # check if program aired
            if re.match('^Did Not Air', title) == None: 

                # print link to console
                print(href)

                # write link and program title to csv
                with open('data/cnn_links.csv', 'a', newline='') as f:
                    csv.writer(f).writerow([show, title, href])