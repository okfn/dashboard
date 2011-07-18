import sys
import ConfigParser

from webstore.client import Database

import mailman
import feed
import bitbucket
import github

import logging

logging.basicConfig(level=logging.NOTSET)
log = logging.getLogger(__name__)

TYPES = {
    'mailman': mailman.gather,
    'feed': feed.gather,
    'bitbucket': bitbucket.gather,
    'github': github.gather
        }

def run(config_file):
    config = ConfigParser.SafeConfigParser()
    config.read([config_file])

    webstore_host = config.get('core', 'webstore.host')
    webstore_user = config.get('core', 'webstore.user')
    webstore_password = config.get('core', 'webstore.password')
    webstore_db = config.get('core', 'webstore.db')
    

    database = Database(webstore_host, webstore_user, webstore_db,
            http_user=webstore_user, http_password=webstore_password)

    for section in config.sections():
        if ':' not in section:
            continue
        type_, name = section.split(':', 1)
        cfg = dict(config.items(section))
        try:
            func = TYPES.get(type_)
            func(database, **cfg)
        except Exception, e:
            log.exception(e)



if __name__ == '__main__':
    if not len(sys.argv) > 1:
        print "Usage: %s gather.cfg" % sys.argv[0]
    run(sys.argv[1])

