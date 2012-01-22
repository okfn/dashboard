A Community Dashboard for the Open Knowledge Foundation. See wiki for details of project:
http://wiki.okfn.org/Community_Dashboard.


Directory Structure
===================

The repository has this layout::

    -- okfn-dashboard
     `-- app: webapp
       `-- js: JavaScript files, often exported by scripts
       `-- css: style sheets
       `-- img: image files
     `-- scripts: scripts to extract data from various sources
     `-- cache: cache directory for data during processing
     `-- data: houses permanent stored (bulk) data
     

For Developers
==============

Frontend App
------------

In your browser visit::

  app/index.html

Frontend App Tests
------------------

In your browser visit::

  app/test/index.html

Backend and Data Harvesting
---------------------------

Setup
~~~~~

If you intend to run python scripts for storing and harvesting data you will
need to:

1. Install python, plus setuptools, pip and virtualenv
2. Install other requirements::

    virtualenv {path-to-your-virtualenv}
    pip -E {your-virtualenv} install --requirement=pip-requirements.txt

3. Install and run a local copy of webstore::

    git clone git@github.com:okfn/webstore
    [follow the instructions inside webstore/README.rst]

4. Copy and paste dashboard.cfg.tmpl to dashboard.cfg and set relevant config
   variables. If you have not modified the webstore configuration, it should 
   work out-of-the-box.

Harvesting
~~~~~~~~~~

Harvesting script is::

  scripts/gather.py

To see command options do::

  python scripts/gather.py -h

The list of people is pulled separately out of the okfn.org buddypress db. A
csv is extracted and posted online at: http://okfn.org/dashboard/cache/okfn_members.csv

You then need to pull it down and have it locally at data/members.csv. Then run::

  python scripts/members.py -h

And follow the instructions.


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

