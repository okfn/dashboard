#!/usr/env/bin python
'''Parse members csv dump exported from mysql into json format.

'''
import csv
import time
import json
import urllib
import subprocess
from collections import defaultdict

def convert_from_csv_to_json(csv_location='cache/members.csv',
                             output_file='cache/members.raw.json'):
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
            print row
    for username in out:
        out[username]['username'] = username
    for username in out:
        out[username] = normalize(out[username])
    outfo = open(hack_file_location(output_file), 'w')
    json.dump(out, outfo, indent=2, sort_keys=True)

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
    data = json.load(open(hack_file_location(FN)))
    baseurl = 'http://api.geonames.org/searchJSON?maxRows=1&username=demo&q='
    for key, value in data.items():
        if 'Location' in value:
            loc = value['Location']
            loc = loc.encode('utf8', 'ignore')
            # loc = loc.replace
            _url = baseurl + urllib.quote(loc)
            fo = urllib.urlopen(_url)
            res = fo.read()
            res = json.loads(res)
            if res['geonames']:
                data[key]['geolocation'] = res['geonames'][0]
                print 'Matched ok: %s to %s' % (loc,
                        res['geonames'][0]['name'].encode('utf8', 'ignore'))
            else:
                print 'Failed to match: %s' % loc
            time.sleep(0.5) 
    fileobj = open('cache/members.geo.json', 'w')
    json.dump(data, fileobj, indent=2, sort_keys=True)


from common import database
def upload_to_webstore():
    table = database['person']
    fileobj = open('cache/members.geo.json')
    out = json.load(fileobj)
    count = 0
    for username, info in out.items():
        count += 1
        data = dict(info)
        data['username'] = username
        data = normalize(data)
        if 'geolocation' in data:
            del data['geolocation']
        table.writerow(data, unique_columns=['username'])
        print 'Processed: %s (of %s)' % (count, len(out))

from datautil.clitools import _main

if __name__ == '__main__':
    _main(locals())

