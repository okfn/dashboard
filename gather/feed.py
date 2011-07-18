import logging

import feedparser

log = logging.getLogger(__name__)

def gather(database, url=None):
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
            author = e.author
        table.writerow({
            'author': author,
            'title': e.title,
            'source_url': e.link,
            'description': e.summary or e.content,
            'type': 'blog',
            'datetime': e.updated
        }, unique_columns=['author', 'title', 'source_url'])
