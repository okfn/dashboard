import logging
import urllib
import json 

URL = 'https://api.github.com/%ss/%s/repos'
FEED = 'https://github.com/%s/%s/commits.atom'

import feed

log = logging.getLogger(__name__)

def gather(database, name=None, account=None):
    url = URL % (account, name)
    log.info('%s: %s' % (account, name))
    urlfh = urllib.urlopen(url)
    data = json.load(urlfh)
    urlfh.close()
    for repo in data:
        furl = FEED % (name, repo['name'])
        feed.gather(database, url=furl, type='github')



