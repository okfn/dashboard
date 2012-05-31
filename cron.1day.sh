#/bin/bash

# Modified version of the 5min script maintains a git history of the DB dump
INFILE=dump.members.sql
OUTREPO=gist/daily
OUTFILE=$OUTREPO/members.csv

cd ~/dashboard
# Run the query and overwrite the dump file
mysql <$INFILE >$OUTFILE
python utf8.py $OUTFILE

# Enter the repo and perform a commit
cd $OUTREPO

if git diff --no-ext-diff --quiet --exit-code; then
  : # no changes
else
  git commit -a -m "Committing lastest database dump." 
  git push origin master 
fi
