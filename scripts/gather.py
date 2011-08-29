#!/usr/bin/env python

import sys
import ConfigParser
import logging

from datautil.clitools import _main
from webstore.client import Database

from common import database
import mailman
import feed
import twitter
import bitbucket
import github
from normalize import normalize


logging.basicConfig(level=logging.NOTSET)
log = logging.getLogger(__name__)

TYPES = {
    'pipermail': mailman.gather_pipermail,
    'mailman': mailman.gather_listinfo,
    'feed': feed.gather,
    'twitter': twitter.gather,
    'bitbucket': bitbucket.gather,
    'github': github.gather
}


def run(config_file='dashboard.cfg'):
    '''Run a gather of stats using config_file (defaults to dashboard.cfg).
    '''
    config = ConfigParser.SafeConfigParser()
    config.read([config_file])

    for section in config.sections():
        if ':' not in section:
            continue
        type_, name = section.split(':', 1)
        cfg = dict(config.items(section))
        try:
            print 'Processing: %s' % cfg
            func = TYPES.get(type_)
            func(database, **cfg)
        except Exception, e:
            log.exception(e)
    
    normalize(database, config)


if __name__ == '__main__':
    _main(locals())

