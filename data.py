'''Parse members csv dump exported from mysql into json format.

'''
import csv
import time
import json
import urllib
from collections import defaultdict
FN = 'members.json'

def convert_from_csv_to_json():
    fo = open('okfn_members.csv', 'rU')
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

    outfo = open('members.json', 'w')
    print len(out)
    json.dump(out, outfo, indent=2, sort_keys=True)

def geocode_data():
    '''Geocode the string locations using geonames.'''
    data = json.load(open(FN))
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
    fileobj = open(FN, 'w')
    json.dump(data, fileobj, indent=2, sort_keys=True)

def make_it_js():
    fo = open(FN)
    out = fo.read()
    fo.close()
    out = 'var members = ' + out
    out += ';'
    fo_out = open('members.js', 'w')
    fo_out.write(out)
    fo_out.close()

if __name__ == '__main__':
    # convert_from_csv_to_json()
    # geocode_data()
    # make_it_js()

