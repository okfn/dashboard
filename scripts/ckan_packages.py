#! /usr/bin/env python
# coding: utf-8

"""
This script converts CKAN packages to JSON objects for timemap.js


Looks at every package in CKAN and tries to find a tag that
can be gecoded for each one. If the package can be associated with a place,
it will geocode it, then it will track a location down. The script then
uses metadata from CKAN to build some data which will be used on the map.
"""

import base64
import bsddb
import json
import urllib2

from time import sleep

from ckanclient import CkanClient, CkanApiError

API_KEY = 'ebaddea3-c28f-4ad2-a4be-8b8ce7f24f60'
CACHE_DIR = '/data/geocode_cache.db'
CACHE = bsddb.btopen(CACHE_DIR)
CKAN = CkanClient(api_key=API_KEY)
GOOGLE_URL= "http://maps.googleapis.com/maps/api/geocode/json?sensor=false&address="
GEONAMES_URL='http://api.geonames.org/searchJSON?maxRows=1&username=tim_okf&q='

au = 'Australia'
aus = au
br = "Brazil"
ca = 'Canada'
cz = "Czech Republic"
de = 'Germany'
eu = "Europe"
fr = "France"
hu = "Hungary"
nz = "New Zealand"
us = 'USA'
uk = 'United Kingdom'
es = 'Spain'

tags = { u'africa': 'Africa',
 u'america': us,
 u'american': us,
 u'amsterdam': 'Amsterdam, Netherlands',
 u'ann-arbor': "Ann Arbor, MI, "+us,
 u'antarctic': "Antarctica",
 u'asia': 'Asia',
 u'assyria': 'Iraq',
 u'athens': "Athens, Greece",
 u'atlantic': "Atlantic Ocean",
 u'australia': au,
 u'australia-council-for-the-arts': au,
 u'australian-communications-and-media-authority': au,
 u'australian-electoral-commission': au,
 u'australian-federal-police': au,
 u'australian-institute-of-criminology': au,
 u'babylon': "Al Hillah, Babil Province, Iraq",
 u'babylonian': "Al Hillah, Babil Province, Iraq",
 u'bangalore': "Bangalore, India",
 u'basquegovernment': 'Basque Country, '+es,
 u'bbc': uk,
 u'br': br,
 u'brazil': br,
 u'brazilian': br,
# u'bre', Breton language?
 u'breton': "France",
 u'brussels': "Brussels, Belgium",
 u'budapest':"Budapest, Hungary",
 u'bulgaria':"Bulgaria",
 u'byzantine': "Iraq",
 u'canada': ca,
 u'catalan': u"Catalunya, " + es,
 u'catalunya': u"Catalunya, " + es,
 u'celtic': uk,
 u'chile': "Chile",
 u'china': "China",
 u'chinese': "China",
 u'circuit-appeals': us,
 u'city-berlin': 'Berlin, '+de,
 u'city-boston': 'Boston, '+us,
 u'city-calgary': 'Calgary, Canada',
 u'city.calgary': 'Calgary, Canada',
 u'city-chicago': 'Chicago, '+us,
 u'city.chicago': 'Chicago, '+us,
 u'city-edmonton': 'Edmonton, '+ca,
 u'city.edmonton': 'Edmonton, '+ca,
 u'city-london': 'London, '+uk,
 u'city.new-orleans': 'New Orleans, '+us,
 u'city-newyork': 'New York, NY, '+us,
 u'city.new-york': 'New York, NY, '+us,
 u'city-portland': 'Portland, Oregon, '+us,
 u'city.portland': 'Portland, Oregon, '+us,
 u'city-sanfrancisco': 'San Francisco, CA, '+us,
 u'city.san-francisco': 'San Francisco, CA, '+us,
 u'city-sydney': 'Sydney, '+au,
 u'city-tokyo': 'Tokyo, Japan',
 u'city-toronto': 'Toronto, '+ca,
 u'city-vancouver':'Vancouver, '+ca,
 u'collier-county': 'Collier County, '+us,
 u'columbia': 'Columbia',
 u'copenhagen': 'Copenhagen, Denmark',
 u'council-of-the-european-union': 'Europe',
 u'country.af' : 'Afghanistan',
 u'country-afghanistan': 'Afghanistan',
 u'country-argentina': 'Argentina',
 u'country.au': au,
 u'country-australia': au,
 u'country.australia': au,
 u'country-austria': "Austria",
 u'country-belgium': "Belgium",
 u'country.bg': "Bulgaria",
 u'country-bulgaria':"Bulgaria",
 u'country.bulgaria':"Bulgaria",
 u'country.ca':"Canada",
 u'country-canada':"Canada",
 u'country.canada':"Canada",
 u'country-cyprus': "Cyprus",
 u'country-czechrepublic': cz,
 u'country-denmark': "Denmark",
 u'country.denmark': "Denmark",
 u'country.es': "Estonia",
 u'country-estonia': "Estonia",
 u'country.estonia': "Estonia",
 u'country-finland': "Finland",
 u'country.finland': "Finland",
 u'country-france': "France",
 u'country.gb': uk,
 u'country-germany': de,
 u'country-greece': "Greece",
 u'country.hu': hu,
 u'country-hungary': hu,
 u'country-iceland': "Iceland",
 u'country-ireland': "Ireland",
 u'country-israel': "Israel",
 u'country-italy': "Italy",
 u'country-japan': "Japan",
 u'country-jordan': "Jordan",
 u'country-latvia': "Latvia",
 u'country-lithuania': "Lithuania",
 u'country-luxembourg': "Luxembourg",
 u'country-lybia': "Lybia",
 u'country-malta': "Malta",
 u'country-mexico': "Mexico",
 u'country-netherlands': "Netherlands",
 u'country-newzealand': nz,
 u'country-norway': "Norway",
 u'country-nz': nz,
 u'country-poland': "Poland",
 u'country-portugal': "Portugal",
 u'country-romania': "Romania",
 u'country-slovakia': "Slovakia",
 u'country-slovenia': "Slovenia",
 u'country-spain': es,
 u'country.spain': es,
 u'country-sweden': es,
 u'country-turkey': "Turkey",
 u'country-uk': uk,
 u'country.uk': uk,
 u'country.united-kingdom': uk,
 u'country.united-states-of-america': us,
 u'country-us': us,
 u'country.us': us,
 u'country-usa': us,
 u'country.usa': us,
 u'county-poland': "Poland",
 u'czech': cz,
 u'datagovuk': uk,
 u'data.gov.uk': uk,
 u'deutschland': de,
 u'developed_in_korea': "Korea",
#  u'directgov', us ?
 u'dutch': "Netherlands",
 u'ed.ac.uk': uk,
 u'edinburgh': "Edinburgh, Scotland, " +uk,
 u'edmonton': "Edmonton, "+ca,
 u'eu': eu,
 u'eu15': eu,
 u'eu-25': eu,
 u'eu-cohesion': eu,
 u'europe': eu,
 u'european': eu,
 u'europeana': eu,
 u'european-commission': eu,
 u'european-parliament': eu, 
 u'european-union': eu,
 u'eurostat': eu,
# u'eutc': eu,?
 u'eutransparency': eu,
# u'faluk', uk ?
 u'federal': us,
 u'florida': "Florida, " +us,
 u'fr': fr,
 u'fra': fr,
 u'france': fr,
 u'geoscience-australia': au,
 u'german': de,
 u'germany': de,
 u'greater-london-authority': "London, "+uk,
 u'greek': "Greece",
 u'guardian': uk,
 u'hungarian': hu,
 u'hungary': hu,
 u'ireland': "Ireland",
 u'islington': "Islington, "+uk,
 u'israel': "Israel",
 u'italian': "Italy",
 u'italy': "Italy",
 u'japanese': "Japan",
 u'jeju': 'Jeju-do, South Korea',
 u'jeju-do': 'Jeju-do, South Korea',
 u'jeju-island': 'Jeju-do, South Korea',
 u'keep-australia-beautiful': au,
 u'kent': "Kent, %s" % uk,
 u'kentish': "Kent, %s" % uk,
 u'korea': 'South Korea',
 u'kosovo': "Kosovo",
# u'lanaguage-slv',
# u'lanaguage-spa',
# u'language-cym',
# u'language-deu',
# u'language-dut',
# u'language-eng',
# u'language-gle',
# u'language-hun',
# u'language-hvr',
# u'language-jpn',
# u'language-kha',
# u'language-nnb',
# u'language-nno',
# u'language-pol',
# u'language-por',
# u'languages',
# u'language-slo',
# u'language-sme',
# u'language-smj',
# u'language-spa',
# u'language-swe',
 u'linked-scotland': "Scotland, "+uk,
 u'london': "London, "+uk,
 u'medicare-australia': au,
 u'mexico': "Mexico",
 u'michigan': "Michigan, "+us,
 u'milwaukee': "Milwaukee, " + us,
 u'naples': "Naples, Italy",
 u'national-archives-of-australia': au,
 u'new-south-wales': "New South Wales, " + au,
 u'newyork': "New York, NY, "+us,
 u'newzealand': nz,
 u'north_carolina': "North Carolina, "+us,
 u'northern-ireland' : "Northern Ireland",
 u'norwegian': "Norway",
 u'nsw-bureau-of-crime-statistics-and-research': "New South Wales, " + au,
 u'nsw-department-of-environment-climate-change-and-water': "New South Wales, " + au,
 u'nsw-premier-s-council-for-active-living': "New South Wales, " + au,
 u'nsw-rural-fire-service': "New South Wales, " + au,
# u'nt', Northern Territory? 
 u'old-bailey': "Old Bailey, London, "+uk,
 u'ordnance': uk,
 u'ordnance-survey': uk,
 u'oregon': "Oregon, " +us,
 u'oxford': "Oxford, "+uk,
 u'portland': "Portland, Oregon, "+us,
 u'powerhouse-museum': "Powerhouse Museum, Sydney, "+au,
 u'powerhouse-museum-collection': "Powerhouse Museum, Sydney, "+au,
 u'powerhouse-museum-photographic-collection-in-flickr-commons': "Powerhouse Museum, Sydney, "+au,
 u'queensland-department-of-environment-and-resource-management': "Queensland, "+au,
 u'queensland-government-information-service': "Queensland, "+au,
 u'roman': eu,
 u'roman_empire': eu,
 u'romanian': "Romania",
 u'russia': "Russia",
 u'russian': "Russia",
 u'scotland': "Scotland, "+uk,
 u'seattle': "Seattle, "+us,
 u'sierra-leone': "Sierra Leone",
 u'smithsonian': "New York, NY, "+us,
 u'southafrica': "South Africa, Africa",
 u'south-america': "South America",
 u'southampton': "Southhampton",
 u'south-australian-department-for-environment-and-heritage-deh': "South Australia, Australia",
u'south-america': 'South America',
u'southhampton' : 'Southhampton, ' + uk,
'sp' : es,
'spain': es,
'Spainish': es,
u'stockholm': 'Stockholm, Sweeden',
u'sustainability-victoria': 'Victoria, ' + aus,
u'timor': 'Timor Leste',
u'timor-leste': 'Timor Leste',
u'turkey': 'Turkey',
u'turkish': 'Turkey',
u'tuscany': 'Tuscany, Italy',
u'uganda': "Uganda",
u'uk': uk,
u'uk-income': uk,
u'uktax': uk,
 u'uruguay': "Uruguay",
 u'us': us,
 u'usa': us,
 u'wales': ', Wales, ' + uk,
 u'usa-state-ca': 'California, ' + us,
 u'usa-state.ca': 'California, ' + us,
 u'usa-state.ma': 'Massachusetts, '+ us,
 u'usa-state.michigan': 'Michigan, ' + us,
 u'usa-state.ny': 'New York State, ' + us,
 u'usa-state.ri': 'Rhode Island, ' + us,
 u'usa-state-ut': 'Utah, ' + us,
 u'usa-state.ut': 'Utah, ' + us,
'usgov': us,
'usgs': us,
'uspto': us,
u'victoria-police': 'Victoria, '+ au, 
u'victoria': 'Victoria, ' + au,
u'wallington': 'Wallington, ' + uk, 
u'warwickshire': 'Warwickshire, ' + uk,
}

def GET(url, cache=CACHE):
    if url not in cache:
        cache[url] = base64.encodestring(urllib2.urlopen(url).read())
    data = cache[url]
    return base64.decodestring(data)

def hack_file_location(f):
    """ 
    Turns a file name into a absolute path name for storage.
    Useful for storing in ../data/ or ../app/js/. Remember to
    use a prepending slash.

    >>> hack_file_location('/app/js/members.js') #doctest: +SKIP
    '/path/to/okfn-dashboard/app/js/members.js'
    """
    return __file__.replace('/scripts/ckan_packages_to_georss.py', f)

def clean_address(addy):
    return addy.replace(' ', '+')

def geocode(address, base_url):
    address = clean_address(address)
    return GET(base_url + address)

def get_country_packages(country):
    packages=set([])
    country = country.strip().split()
    if len(country) > 1:
        tags = [''.join(country), 
                '-'.join(country), 
                'country.'+''.join(country),
                'country-' + '-'.join(country)]
    else:
        tags = [country, 'country.'+country, 'country-'+country]
    results = map(CKAN.tag_entity_get, tags)
    for res in results:
        for tag in res:
            packages.add(res)
    return packages

def ckan_pkg_to_desc(pkg):
    about = u'<code><a href="{url}">{name}</a></code>'.format(url=pkg['ckan_url'], name=pkg['name'])
    notes = u'<pre>'
    if pkg['notes']:
        notes = notes + pkg['notes'].replace('#', '').strip()
    notes = notes + u'</pre>'
    tags = u', '.join(u'<span class="tag"><a href="http://ckan.net/tag/{t}">{t}</a></span>'.format(t=tag) for tag in pkg['tags'])
    tags = u'<p class="tags">Tags: ' + tags + u'</p>'
    return u'<div class="pkg-info">' + about + notes + tags + u'</div>'
    
def get_pkg_data(package_name, ckan_client=CKAN, base_url=GEONAMES_URL,error_count=0):
    pkg = ckan_client.package_entity_get(package_name)
    #can any of the package's tags be geocoded?
    if any(t for t in pkg['tags'] if t in tags):
        #geocode the first one that can be
        place_to_geocode = tags[[t for t in pkg['tags'] if t in tags][0]]
        location_details = geocode(place_to_geocode, base_url=base_url)
        try:
            location = json.loads(location_details)
        except:
            print 'ERROR decoding {place}'.format(place=place_to_geocode)
            print location_details
            if error_count==0:
                del CACHE[base_url+place_to_geocode]
                return get_pkg_data(package_name, error_count=1)
            else:
                raise
        yield pkg, location

def to_geojson(pkg, geocode_response, mode='geonames'):
    """
    Takes a package_entity from CKAN's API and a response from 
    geonames' geocoder and merges the two into GeoRSS.

    warning: doesn't (yet) comply with GeoRSS. Was originally crafted
    for http://code.google.com/p/timemap/
    """
    item = {"type":"Feature"}
    item['properties'] = dict(title=pkg['title']
                             created_at= pkg['metadata_created']
                             description=ckan_pkg_to_desc(pkg))
    if mode == 'geonames'
        coords = (geocode_response['geonames'][0]['lat'],
                  geocode_response['geonames'][0]['lng'])
    elif mode == 'google':
        coords = (geocode_response['results'][0]['geometry']['location']['lat'],
                  geocode_response['results'][0]['geometry']['location']['lng'])
    else:
        raise NotImplementedError
    item['geometry'] = {'type':"Point", "coordinates": coords}
    return item


def do_pkg(pkg_name, count=0):
    try:
        pkg_data, geocode_res = get_pkg_data(pkg_name)
    except CkanApiError as e:
        print 'ERROR while downloading "{pkg}" from CKAN ({c})'.format(c=count, pkg=pkg_name)
        print e
        if count < 5:
            sleep(1 + 1.5*count)
            return do_pkg(pkg_name, count=count+1)
        else:
            print 'ABORTING: CKAN is either busted or angry'
            raise
    feature = to_geojson(pkg_data, geocode_res)
    return feature

def main():
    for pkg in CKAN.package_register_get():
        print pkg
        res = do_pkg(pkg)
        if res:
            print res
            yield res

if __name__ == "__main__":
    with open(hack_file_location('/data/ckan_packages.geojson', 'w') as f:
        f.write('var ckan = ')
        fcollection = { "type": "FeatureCollection" }
        fcollection['features'] = [f for f in main()]
        f.write(json.dumps(fcollection))
