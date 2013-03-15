A Community Dashboard for the Open Knowledge Foundation. See wiki for details
of project: http://wiki.okfn.org/Community_Dashboard.

* Live site: http://okfnlabs.org/dashboard/
* Git repo: http://github.com/okfn/dashboard
* Issues: http://github.com/okfn/dashboard/issues
* Mailing list: http://lists.okfn.org/mailman/listinfo/okfn-labs


Developers
==========

Deployment is via gh-pages but you need to have "built" the app using brunch
first. To make changes and deploy you do:

1. Edit stuff in master branch and commit
2. Run `brunch build` this will create a public directory
3. Switch to gh-pages
4. Copy contents of new public folder to root directory
5. Commit and deploy gh-pages branch

