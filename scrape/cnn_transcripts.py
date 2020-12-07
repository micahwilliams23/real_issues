# import packages
from bs4 import BeautifulSoup as soup
import requests
import pandas as pd
import multiprocessing as mp
import os
import csv

# threading structure from https://medium.com/python-in-plain-english/parallel-web-scraping-and-api-connection-a-way-to-save-lots-of-time-part-i-i-python-d23f9fc258ca

# wrap program in function for multithreading
def scrapeTranscript(link):

    # webpage urls
    base_url = 'http://transcripts.cnn.com'

    # add headers to request
    req_headers = {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.8',
        'x-requested-with': 'XMLHttpRequest',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
    }

    try:

        # get and parse webpage with BeautifulSoup
        page_html = requests.get(url=base_url + link, headers=req_headers).content
        page_soup = soup(page_html, 'html.parser')

        # extract show name and program title
        show = page_soup.find('p', {'class': 'cnnTransStoryHead'}).text
        title = page_soup.find('p', {'class': 'cnnTransSubHead'}).text
        
        # extract body elements (air date, transcript)
        body_divs = page_soup.findAll('p', {'class': 'cnnBodyText'})
        aired = body_divs[0].text
        # transcript = body_divs[2].text

        with open('data/titles.csv', 'a', newline = '') as f:
            csv.writer(f).writerow([show, title, aired, link])

    except ConnectionError:
        print('connection failed :(')

    except:
        print('something else went wrong')


# define threading function
def runParallel(infile):

    # load dataframe from csv...
    df = pd.read_csv('data/shows/'+infile)

    # and extract links
    tlinks = df['href'].tolist()

    # run scrape in 7 parallel processes
    p = mp.Pool(7)
    p.map(scrapeTranscript, tlinks)
    p.terminate()
    p.join()

if __name__ == '__main__':

    with open('data/titles.csv', 'w', newline = '') as f:
        csv.writer(f).writerow(['show', 'title', 'aired', 'link'])

    mp.freeze_support()
    show_paths = os.listdir('data/shows')[4:]

    for show in show_paths:
        name = os.path.splitext(show)[0]
        print(f'scraping from {name.title()}')
        
        runParallel(show)