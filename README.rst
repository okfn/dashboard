A Community Dashboard for the Open Knowledge Foundation. See wiki for details
of project: http://wiki.okfn.org/Community_Dashboard.

* Live site: http://okfnlabs.org/dashboard/
* DataHub Dataset: http://datahub.io/dataset/okfn-dashboard
* Git repo: http://github.com/okfn/dashboard
* Issues: http://github.com/okfn/dashboard/issues
* Mailing list: http://lists.okfn.org/mailman/listinfo/okfn-labs


Using It
========

First, setup the git submodules needed by the frontend app::

  git submodule init
  git submodule update

Then, just open in your browser::

  index.html

Note: if you are using Chrome you may need to open this from a webserver as
chrome prevents loading the local data files (even if you are opening a local
file) for security reasons.


For Developers
==============

Directory Structure
-------------------

The repository has this layout::

    -- okfn-dashboard
     `index.html: JS webapp
     `-- js: JavaScript files, often exported by scripts
     `-- css: style sheets
     `-- img: image files
     `-- test: js tests
     `-- scripts: scripts to extract data from various sources
     `-- cache: cache directory for data during processing
     `-- data: houses permanent stored (bulk) data

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

3. Install and run a local copy of ElasticSearch or use the DataHub.

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

