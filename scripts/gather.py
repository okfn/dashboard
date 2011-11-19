#!/usr/bin/env python

import sys
import ConfigParser
import logging
import csv

from datautil.clitools import _main
from datautil.cache import Cache
from webstore.client import Database

from common import database, config, Source
import mailman
import feed
import twitter
#from normalize import normalize


logging.basicConfig(level=logging.NOTSET)
log = logging.getLogger(__name__)

TYPES = {
    'mailman': mailman.gather_pipermail,
    'trac': feed.gather,
    'wordpress': feed.gather,
    'twitter': twitter.gather,
    'bitbucket': feed.gather,
    'github': feed.gather,
    'mediawiki': feed.gather
}


def run(source_id=None, config_file='dashboard.cfg'):
    '''Run a gather of stats using config_file (defaults to dashboard.cfg).

    Can specify a source id to just gather for that source.
    '''
    cache = Cache('cache')
    csv_url = config.get('db', 'sources')
    fp = cache.retrieve(csv_url)
    fo = open(fp)
    for dict_ in csv.DictReader(fo):
        source = Source(dict_)
        if source_id and not(source_id == source.id):
            continue
        try:
            log.info('Processing: %s' % source.id)
            assert source.type in TYPES, 'No handler for this source of type: %s' % source.type
            func = TYPES[source.type]
            func(database, source, config)
        except Exception, e:
            log.error(e)
    
    #normalize(database, config)

if __name__ == '__main__':
    _main(locals())

