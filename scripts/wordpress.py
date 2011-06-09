#! /usr/env/bin python
# coding: utf-8

from datetime import datetime, timedelta
from xml.dom import minidom
import urllib2
import tempfile

sites = ['http://blog.okfn.org/feed/', 'http://notebook.okfn.org/feed/']

def get_feed(url):
    r = urllib2.Request(url)
    r.add_header('Accept', 'application/rss+xml')
    res = urllib2.urlopen(r)
    return res.read()

def feed_to_obj(feed_content):
    feed = minidom.parseString(feed_content)
    for item in feed.getElementsByTagName('item'):
        d = item.getElementsByTagName('pubDate')[0].firstChild.nodeValue
        d, tz_info = d[:-5], d[-5:]
        neg, hours, minutes = tz_info[0], int(tz_info[1:3]), int(tz_info[3:])
        if neg == '-':
            hours = -hours
            minutes = -minutes
        d = datetime.strptime(d, '%a, %d %b %Y %H:%M:%S ')
        d = d + timedelta(hours=hours, minutes=minutes)
        d = d.isoformat()
        categories = ', '.join(el.firstChild.nodeValue for el in item.getElementsByTagName('category'))
        yield (d, categories)

def main():
    for site in sites:
        feed = get_feed(site)
        for item in feed_to_obj(feed):
            print item
    
if __name__ == "__main__":
    main()
