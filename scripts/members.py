#!/usr/bin/env python

'''Parse members csv dump exported from mysql into json format.

'''

import csv
import time
import json
import urllib
import subprocess
from collections import defaultdict

import common
from datautil.clitools import _main

CSV_SOURCE = 'data/members.csv'
MEMBERS_RAW = 'cache/members.raw.json'
MEMBERS_GEO = 'cache/members.geo.json'

def convert_from_csv_to_json(csv_location=CSV_SOURCE,
        output_file=MEMBERS_RAW):
    fo = open(csv_location, 'rU')
    reader = csv.reader(fo)
    out = defaultdict(dict)
    for row in reader:
        # data looks like ['rgrp', 'Name', 'Rufus Pollock']
        if not row:
            continue
        key = row[0]
        try:
            # various hacks to deal with mysql slightly weird csv
            # issue is description is wrapped to multiple lines and this is not
            # parsed correctly by python csv module
            if '\n' in key or '\t' in key or ' ' in key:
                continue
            out[key][row[1]] = row[2]
        except:
            print('Error: %s' % row)
    for username in out:
        out[username]['username'] = username
        out[username]['id'] = username
    for username in out:
        out[username] = normalize(out[username])
    outfo = open(output_file, 'w')
    json.dump(out.values(), outfo, indent=2, sort_keys=True)


def normalize(datadict_):
    out = dict(datadict_)
    for key,val in out.items():
        del out[key]
        out[key.lower()] = val
    desc = u'description/ about me'
    if desc in out:
        out['description'] = out[desc]
        del out[desc]
    return out


def geocode_data():
    '''Geocode the string locations using geonames.'''
    report_file = MEMBERS_GEO + '.report.json'
    report = []
    data = json.load(open(MEMBERS_RAW))
    geocode_username = common.config.get('geocode', 'username')
    baseurl = 'http://api.geonames.org/searchJSON?maxRows=1&username=%s&q=' % geocode_username
    for value in data:
        if 'location' in value:
            loc = value['location']
            loc = loc.encode('utf8', 'ignore')
            # loc = loc.replace
            _url = baseurl + urllib.quote(loc)
            fo = urllib.urlopen(_url)
            res = fo.read()
            res = json.loads(res)
            if res['geonames']:
                value['spatial'] = res['geonames'][0]
                msg = 'Matched ok: %s to %s' % (loc,
                        res['geonames'][0]['name'].encode('utf8', 'ignore'))
                status = 'ok'
            else:
                status = 'error'
                msg = 'Failed to match: %s' % loc
            report.append([value['id'], status, msg])
            print msg
            time.sleep(0.5) 
    fileobj = open(MEMBERS_GEO, 'w')
    json.dump(data, fileobj, indent=2, sort_keys=True)
    json.dump(report, open(report_file), indent=2, sort_keys=True)


if __name__ == '__main__':
    _main(locals())
