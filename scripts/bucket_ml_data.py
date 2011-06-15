#! /usr/bin/env python

"""
This script pulls data posted times from the OKFN mailing lists
and groups them into weekly counts.
"""
import json
from random import choice
from datetime import datetime, timedelta

from pandas import *

def hack_file_location(f):
    """ 
    Turns a file name into a absolute path name for storage.
    Useful for storing in ../data/ or ../app/js/. Remember to
    use a prepending slash.

    >>> hack_file_location('/app/js/members.js') #doctest: +SKIP
    '/path/to/okfn-dashboard/app/js/members.js'
    """
    return __file__.replace('/scripts/bucket_ml_data.py', f)


def dither(L):
    """
    Dithers a list of datetimes. That is, if there are two times that 
    identical in the list, it will make an adjustment to any duplicates.
    """
    ndups = len(L) - len(set(L))
    if ndups > 0:
        for i, t in enumerate(L):
            if L.count(t) > 1:
                L[i] = t + timedelta(seconds=choice(xrange(-59, 59)))
        return dither(L)
    return L

def closest_week(dtime):
    """
    Takes a datetime object and groups it into a week
    >>> closest_week(datetime.datetime(2011, 5, 12, 18, 57, 18))
    datetime.datetime(2011, 5, 8, 0, 0)
    """
    #rng = DateRange(start='1/1/2000', end='1/1/2012', offset=datetools.Week(1))
    rng = DateRange(start='1/1/2000', end='1/1/2012', offset=datetools.MonthEnd(1))
    
    # filter out some junk data at "1 Jan 1970"
    if dtime < rng[0]:
        return datetime(1900, 1, 1, 0, 0, 0)
    for i, t in enumerate(rng):
        if t >= dtime:
            return rng[i-1]

def main():
    mailinglists = {}

    with open(hack_file_location('/data/mailinglist_activity.csv')) as f:
        a = f.read()

    for line in a.split():
        sent_at, mlist, n = line.split(',')
        sent_at = datetime.strptime(sent_at, "%Y-%m-%dT%H:%M:%S")
        if mlist in mailinglists:
            mailinglists[mlist].append(sent_at)
        else:
            mailinglists[mlist] = [sent_at]

    # convert the mailing list data into numpy arrays
    for mlist in mailinglists.iterkeys():
        try:
            s = Series(1, mailinglists[mlist])
        except Exception as e:
            if 'cannot contain duplicate values' in e.message:
                s = Series(1, dither(mailinglists[mlist]))
        mailinglists[mlist] = s.groupby(closest_week).aggregate(len)

    # group fill blank values with zeroes
    mldm = DataMatrix(mailinglists).fillna(0.0)
    for mlist in mldm:
        mailinglists[mlist] = mldm[mlist].tolist()[1:] #hack to filter junk data
    
    with open(hack_file_location('/data/mldata.js'), 'w') as f:
        f.write('var mldata = ')
        f.write(json.dumps([mailinglists[ml] for ml in mailinglists]))

if __name__ == "__main__":
    main()
