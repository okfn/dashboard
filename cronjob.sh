#/bin/bash

# cronjob to pull the list of users from the database and store it into a CSV file accessible via okfn.org's public webserver.
INFILE=dump.sql
OUTREPO=gist/latest
OUTFILE=$OUTREPO/members.csv

cd ~/dashboard
# Run the query and overwrite the dump file
mysql <$INFILE >$OUTFILE

# Enter the repo and perform a commit
cd $OUTREPO
# git diff --no-ext-diff --quiet --exit-code
#git commit -a -m "Hourly dump of members."
#git pull origin members-db-dump
#git push origin members-db-dump
