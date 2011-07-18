import urllib
import logging
import json 

URL = 'https://api.bitbucket.org/1.0/users/%s/'
FEED = 'https://bitbucket.org/%s/%s/rss'

import feed

log = logging.getLogger(__name__)

def gather(database, name=None):
    url = URL % name
    log.info(name)
    urlfh = urllib.urlopen(url)
    data = json.load(urlfh)
    urlfh.close()
    for repo in data['repositories']:
        furl = FEED % (account, repo['name'])
        feed.gather(database, url=furl)

