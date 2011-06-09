#! /usr/bin/env python
# coding: utf-8

"""
This script extracts metadata from activities within Trac
"""
from datetime import datetime
from xml.dom import minidom
import urllib2
import tempfile



URL = 'http://trac.okfn.org/timeline?ticket=on&milestone=on&wiki=on&max=50&author=&daysback=90&format=rss'

def GET(url, cache=CACHE):
    req = urllib2.Request(url)
    req.add_header('Accept', 'application/rss+xml')
    res = urllib2.urlopen(url)
    return res.read()
    
def get_feed(url):
    return GET(url)

def feed_to_obj(feed_content):
    feed = minidom.parseString(feed_content)
    for item in feed.getElementsByTagName('item'):
        date = item.getElementsByTagName('pubDate')[0].firstChild.nodeValue
        date = datetime.strptime(date, "%a, %d %b %Y %H:%M:%S %Z").isoformat()
        category = item.getElementsByTagName('category')[0].firstChild.nodeValue
        yield (date, category)

def main():
    feed = get_feed(URL):
    with tempfile.TemporaryFile() as f:
        for item in feed_to_obj(feed):
            f.write(item)
        f.seek(0)
        print f.read()

if __name__ == "__main__":
    main()
