#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import ConfigParser
import urllib
import json
import unittest

# Add 'scripts' folder to module search path allowing to execute 
# this test module from inside its 'test' folder.
path = os.path.join(os.path.dirname(__file__), '..')
sys.path.insert(0, path)
del path

import feed
import twitter
from common import database
from normalize import normalize


config = ConfigParser.SafeConfigParser()
config_file = os.path.join('..', 'dashboard.cfg')
config.read([config_file])
host, user, db = [config.get("db", "webstore.%s" % val) 
    for val in "host user db".split()]


class DashboardTestCase(unittest.TestCase):

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_feed(self):
        url = "http://blog.okfn.org/feed/"
        feed.gather(database, url=url)
        
        # Todo: now do the real testing...

    def test_twitter(self):
        url0 = "http://%s/%s/%s/activity.json" % (host, user, db)
        print "Checking database:", url0
        j = urllib.urlopen(url0).read()
        rows0 = json.loads(j)
        url = "http://twitter.com/okfn"
        twitter.gather(database, url=url)
        j = urllib.urlopen(url0).read()
        rows1 = json.loads(j)
        # quite unimpressive test, but a start
        self.assert_(len(rows0) <= len(rows1))


if __name__ == '__main__':
    unittest.main()
