import logging
from time import mktime
from datetime import datetime

import feedparser

log = logging.getLogger(__name__)

def gather(database, url=None, type='blog'):
    feed = feedparser.parse(url)
    try:
        log.info(feed.feed.title)
    except AttributeError:
        log.info(url)
    table = database['activity']
    for e in feed.entries:
        try:
            author = e.author_detail.name
        except AttributeError:
            try:
                author = e.author
            except AttributeError:
                print "NO AUTHOR", e
                author = ''
        try:
            description = e.summary
        except AttributeError: 
            try:
                description = e.content
            except AttributeError:
                description = ''

        date = datetime.fromtimestamp(mktime(e.updated_parsed))
        table.writerow({
            'author': author,
            'title': e.title,
            'source_url': e.link,
            'description': description,
            'type': type,
            'datetime': date.isoformat()
        }, unique_columns=['author', 'title', 'source_url'])
