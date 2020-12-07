# import packages
from bs4 import BeautifulSoup as soup
import requests
import pandas as pd
from concurrent.futures import ThreadPoolExecutor
import threading
import csv

# threading structure from https://medium.com/python-in-plain-english/parallel-web-scraping-and-api-connection-a-way-to-save-lots-of-time-part-i-i-python-d23f9fc258ca

# wrap program in function for multithreading
def scrapeTranscript(infile):

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

    # create csv file for outputs...
    cols = ['show', 'title', 'aired', 'transcript', 't_link']
    with open('data/cnn_transcripts.csv', 'w', newline='') as f:
            csv.writer(f).writerow(cols)

    # and dictionary for temporary storage (for speed, per https://stackoverflow.com/questions/64951767/scraping-data-parallel-batch-processing)
    outputData = dict((k, []), for k in cols)

    # load dataframe from csv...
    # df = pd.read_csv(infile)
    df = infile

    # and extract links
    transcript_links = df['href'].tolist()

    # iterate through show links
    for t_link in transcript_links:

        # get and parse webpage with BeautifulSoup
        page_html = requests.get(url=base_url + t_link, headers=req_headers).content
        page_soup = soup(page_html, 'html.parser')

        # extract show name and program title
        show = page_soup.find('p', {'class': 'cnnTransStoryHead'}).text
        title = page_soup.find('p', {'class': 'cnnTransSubHead'}).text
        
        # extract body elements (air date, transcript)
        body_divs = page_soup.findAll('p', {'class': 'cnnBodyText'})
        aired = body_divs[0].text
        transcript = body_divs[2].text

        # write data to dataframe
        cols = ['show', 'title', 'aired', 'transcript', 't_link']
        outputData['show'].append(show)
        outputData['title'].append(title)
        outputData['aired'].append(aired)
        outputData['transcript'].append(transcript)
        outputData['t_link'].append(t_link)

    # return pandas dataframe
    return outputData

# define threading function
def runParallel(infile):
    with ThreadPoolExecutor(max_workers=7) as executor:
        return executor.map(scrapeTranscript,
        infile,
        timeout = 60)

runParallel('data/cnn_links_b.csv')