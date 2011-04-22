A Community Dashboard for the Open Knowledge Foundation.

Features
========

* Member Map - map of members with links to pages on Google Map

Planned
=======

* Working Group Activity
* Summary of Change Activity on Wikis and Related Projects

See this original idea to suggest more and comment:

<http://ideas.okfn.org/ideas/100/a-community-dashboard-for-the-open-knowledge-foundation-okfn>


For Developers
==============

We get source data directly via an export from wordpress db using sql in
export.sql. This is then transformed to json file named members.json using the
scripts in data.py.

Running App Locally
-------------------

To test e.g. the members map locally you need to allow the browser access to
local (json) files. This is fine by default in FF and IE but in Chrome you
need to pass the following option::

  --allow-file-access-from-files

TODO
----

2011-04-22 p:members Conversion from csv dump of members to json is not
handling wrapped lines (in descriptions) correctly.

2011-04-22 p:members cannot see more than one marker if 2 markers in exact
same long/lat (as happens frequently because we have imprecise initial
locations). Can fix this by using a random small offset to markers or
rotation.
