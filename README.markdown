Branch: Database Scraper
========================

This lives on our Wordpress MySQL server. The script is run by cron every five minutes; it updates a public data source listing the members of our website.

The data source lives in a public gist:
    https://gist.github.com/2839389

To grab the latest list in CSV format:
    https://raw.github.com/gist/2839389/9721f58d2511fe6ae0a3a9709119afd9c9306dda/members.csv

...and in JSON format:
    https://raw.github.com/gist/2839389/a8644979c307b9efd63aef744b540c3fcf986983/members.json

...and in JSONP format:
    https://raw.github.com/gist/2839389/5a0da82962cbd9be9fd3781a2d5efa1b8a89417d/members.jsonp
