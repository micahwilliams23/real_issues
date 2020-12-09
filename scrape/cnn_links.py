# import required libraries
from bs4 import BeautifulSoup as soup
import requests
import regex as re
import csv

# EXPLANATION OF CODE:
# my goal was to find the titles of CNN programs to analyze trends/word frequency/etc.
# this script finds title of every program of show (and link to program transcript) on transcripts.cnn.com/TRANSCRIPTS

# webpage urls
url = 'http://transcripts.cnn.com/TRANSCRIPTS/' # url of starting page with list of shows
base_url = 'http://transcripts.cnn.com' # this url will be useful later since the links found on page are relative to this address

# add headers to request - sometimes webpage will not load without these
# sending them makes your request seem more like it was made by a real person
req_headers = {
    # honestly not really sure how important these are, but I keep them around for good luck
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.8',
    'x-requested-with': 'XMLHttpRequest',

    # user agent makes it seem like the request is coming from a browser
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
}

# open csv and write column names - create a file to store the scraped data and write a row of column names ('show', 'title', 'href')
with open('data/cnn_links.csv', 'w', newline='') as f: # the default for newline will add empty lines between rows, so set to '' (nothing)
    csv.writer(f).writerow(['show', 'title', 'href'])

# get webpage with requests library and parse webpage with BeautifulSoup
# requests.get will send back a bunch of different things- .content gets the html content of the page
page_html = requests.get(url=url, headers=req_headers).content
# use BeautifulSoup (as soup) to parse the html and create and object that can be easily searched
page_soup = soup(page_html, 'html.parser')

# find links to CNN shows 
# within BeautifulSoup object, find an element that matches <table id='cnn_categorytable>[a bunch of html]</table>
link_table = page_soup.find('table', {'id': 'cnn_categorytable'}) # .find() only returns the first element that matches

# within the table from above, find all the <a> elements
show_links = link_table.findAll('a') # .findAll() returns a list of all matching elements

# iterate through show links
for show_link in show_links:

    # extract the name of the show- in this case, it's just the label of the link: <a>[text]</a>
    show = show_link.text

    # follow the link and parse webpage with BeautifulSoup... notice the base_url + show_link['href'] as the url
    # show_link['href'] = <a href=[this part]>[text]</a>
    page_html = requests.get(url=base_url + show_link['href'], headers=req_headers).content
    page_soup = soup(page_html, 'html.parser')

    # find all div elements (contain links) <div class='cnnSectBulletItems'>[stuff]</div>
    link_divs = page_soup.findAll('div', {'class': 'cnnSectBulletItems'})

    # iterate through div elements (each one is a day of programming)
    for div in link_divs:

        # find link elements
        t_links = div.findAll('a')

        # iterate through link elements (each one is a program that aired on CNN)
        for link in t_links:

            # extract title and href from link element
            href = link['href']
            title = link.text

            # check if program aired using regular expressions- ignore the links that are titled 'Did Not Air'
            if re.match('^Did Not Air', title) == None: # this says 'if there are no matches in the title for 'Did Not Air'

                # print link to console so you can see progress happening
                print(href)

                # write link and program title to csv- notice the 'a' which appends to the csv file. 'w' would overwrite the file every time
                with open('data/cnn_links.csv', 'a', newline='') as f:
                    csv.writer(f).writerow([show, title, href])