#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import ConfigParser
import unittest

# Add 'scripts' folder to module search path allowing to execute 
# this test module from inside its 'test' folder.
path = os.path.join(os.path.dirname(__file__), '..', 'scripts')
sys.path.insert(0, path)
del path

import feed
import twitter
from common import database
from normalize import normalize


class DashboardTestCase(unittest.TestCase):

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_feed(self):
        url = "http://blog.okfn.org/feed/"
        feed.gather(database, url=url)
        
        config = ConfigParser.SafeConfigParser()
        config.read(["../dashboard.cfg"])
        # normalize(database, config)

        # Todo: now do the real testing...

    def test_twitter(self):
        url = "http://twitter.com/okfn"
        twitter.gather(database, url=url)
        
        config = ConfigParser.SafeConfigParser()
        config.read(["../dashboard.cfg"])
        # normalize(database, config)

        # Todo: now do the real testing...


if __name__ == '__main__':
    unittest.main()
