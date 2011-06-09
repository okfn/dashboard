A Community Dashboard for the Open Knowledge Foundation.

Features
========

* Member Map - map of members with links to pages on OpenStreetMap

Planned
=======

* Working Group Activity
* Summary of Change Activity on Wikis and Related Projects

See this original idea to suggest more and comment:

<http://ideas.okfn.org/ideas/100/a-community-dashboard-for-the-open-knowledge-foundation-okfn>


For Developers
==============

Philosophy
----------

The dashboard application itself should be as simple as possible. Preferably,
little more than an `index.html` file and associated resources. The data 
should come from stand alone scripts that can be run periodically.

Example: Map
````````````

We get source data directly via an export from wordpress db using sql in
export.sql. This is then transformed to json file named members.json using the
scripts in data.py.

Directory Structure
-------------------

The repository has this layout::

    -- okfn-dashboard
     `-- app: webapp
       `-- js: JavaScript files, often exported by scripts
       `-- css: style sheets
       `-- img: image files
     `-- scripts: scripts to extract data from various sources
     `-- data: houses (bulk) data for processing by scripts
     

Running App Locally
-------------------

To test e.g. the members map locally you need to allow the browser access to
local (json) files. This is fine by default in FF and IE but in Chrome you
need to pass the following option::

  --allow-file-access-from-files

Conventions
-----------

Scripts should

 - Declare `__update_freqency__` as `'m'`, `'h'`, `'d'`, `'w'` to indicate
   that their script should be run every minute, hour, day or week 
   respectively. 
 - use the Python standard library

Scripts will be run daily by default.

TODO
----

2011-04-22 p:members Conversion from csv dump of members to json is not
handling wrapped lines (in descriptions) correctly.

2011-04-22 p:members cannot see more than one marker if 2 or more markers
in exact same long/lat (as happens frequently because we have imprecise 
initial locations).

2011-04-25 p:members 
Replaced Google Maps with OpenStreetMap by using OpenLayers.
OKFN logo used as a marker for the members positions.
Problem of overlapping data with the same coordinates solved 
by using the clustering function of OpenLayers:
click on the icon and this show the list of 
members in that place (this depends on the zoom level).
Possible fix: change the icon size in relation to the number of users
