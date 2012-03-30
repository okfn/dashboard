import logging
from time import mktime
from datetime import datetime

import feedparser
from common import make_activity

log = logging.getLogger(__name__)


def gather(database, source):
    feed = feedparser.parse(source.feed_url)
    try:
        log.info("%s: %s" % (source.type, feed.feed.title))
    except AttributeError:
        log.error('Failed to retrieve: %s' % source.feed_url)
    table = database['activity']
    count = 0
    for e in feed.entries:
        count += 1
        try:
            author = e.author_detail.name
        except AttributeError:
            try:
                author = e.author
            except AttributeError:
                author = ''
        try:
            description = e.summary
        except AttributeError: 
            try:
                description = e.content[0].value
            except AttributeError:
                description = ''
        # HACKy
        if source.type == 'mediawiki':
            description = description.split('\n')[0]

        date = datetime.fromtimestamp(mktime(e.updated_parsed))
        data = {
            'author': author,
            'title': e.title,
            'source_url': e.link,
            'description': description
        }
        data = make_activity(data, date, source)
        table.writerow(
            data,
            unique_columns=['author', 'title', 'source_url']
            )
    return count

