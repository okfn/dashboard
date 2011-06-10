#! /usr/bin/env python
"""
This script tries to extract data from each of the OKFN mailing lists.
"""

import gzip
import re
import urllib2
from urllib2 import urlopen
from datetime import datetime
from StringIO import StringIO
DOMAIN = 'lists.okfn.org'
ROOT_URL = 'http://{domain}/mailman/listinfo'.format(domain=DOMAIN)

def iter_list_urls(listinfo_page=ROOT_URL):
    """
    >>> for l in iter_list_urls(): #doctest: +ELLIPSIS
    ...     print l
    annotator-dev
    ...
    wsfii-discuss
    """
    page = urlopen(listinfo_page).read()
    for mailinglist in re.finditer('href="{p}/(.*)"'.format(p=listinfo_page), page):
        yield mailinglist.groups()[0]

def posts(list_name, domain=DOMAIN):
    url = 'http://{domain}/pipermail/{list_name}/'.format(domain=domain, list_name=list_name)
    print 'Fetching ...{url}'.format(url=url)
    try:
        page = urllib2.urlopen(url).read()
    except urllib2.HTTPError as e:
        if e.code >= 500:
            raise
        print e #probably a private list
        page = ''
    archives = [urllib2.urlopen(url+a) for a in re.findall('"(.*.txt.gz)', page)]
    for archive in archives:
        with gzip.GzipFile(fileobj=StringIO(archive.read())) as g:
            # 'Thu May 12 21:32:47 2011'  
            post_times = re.findall(' \w{3} [0-9]{2} [0-9:]{8} [0-9]{4}', g.read())
            for t in post_times:
                yield datetime.strptime(t, " %b %d %H:%M:%S %Y").isoformat()
        

def list_name_to_archive_index(name, domain=DOMAIN):
    return 'http://{domain}/pipermail/{list_name}/'.format(domain=domain, list_name=name)

def main():
    times = []
    for list_name in iter_list_urls():
        for post in posts(list_name):
            # crafting everything as a string to avoid using a custom sort 
            # function later on
            datum = '{post_time},{mlist},1'.format(post_time=post, mlist=list_name)
            print datum
            times.append(datum)
    times = sorted(times)
    with open('/home/tim/OKFN/okfn-dashboard/data/mailinglist_activity.csv', 'w') as f:
        print 'Writing to disk'
        f.write('\n'.join(times))
if __name__ == "__main__":
    main()
