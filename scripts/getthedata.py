#! /usr/bin/env python
"""
This script extracts times of questions from getthedata.org's RSS
feed. It should work with any OSQA site with appropriate changes
to the DOMAIN variable.
"""

import gzip
import re
import urllib2
from datetime import timedelta
from urllib2 import urlopen
from datetime import datetime
from StringIO import StringIO

DOMAIN = 'getthedata.org'

def questions(domain=DOMAIN):
    url = "http://{domain}/feeds/rss".format(domain=domain)
    print 'Fetching ...{url}'.format(url=url)
    try:
        res = urllib2.Request(url)
        res.add_header('Accept-Encoding', 'gzip')
        page = urllib2.urlopen(res)
    except urllib2.HTTPError as e:
        #TODO: add logging support
        raise
    with gzip.GzipFile(fileobj=StringIO(page.read())) as g:
            page = g.read()
            print page[:100]
            # 'Thu, 21 Apr 2011 19:54:12 +0100'
            post_times = re.findall('<pubDate>(\w{3}, [0-9]{2} \w{3} [0-9]{4} [0-9:]{8} [+-][0-9]{4})', page)
            for t in post_times:
                # -> t= 'Thu, 21 Apr 2011 19:54:12' tz_offset = '+0100'
                t, tz_offset = t[:-6], t[-5:]
                neg, hh, mm = tz_offset[0], int(tz_offset[1:3]), int(tz_offset[3:])
                if neg == '-':
                    hh = -hh
                    mm = -mm
                t = datetime.strptime(t, "%a, %d %b %Y %H:%M:%S")
                t = t + timedelta(hours=hh, minutes=mm)
                yield t.isoformat()

def main():
    for q in questions():
        print q, DOMAIN, 1

if __name__ == "__main__":
    main()
