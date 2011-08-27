#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import unittest


# Add 'scripts' folder to module search path allowing to execute 
# this test module from inside its 'test' folder.
path = os.path.join(os.path.dirname(__file__), '..', 'scripts')
sys.path.insert(0, path)
del path


class DashboardTestCase(unittest.TestCase):

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test(self):
        pass


if __name__ == '__main__':
    unittest.main()
