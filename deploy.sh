#!/bin/bash

echo 'Building minified uglified web-app...'
brunch build --minify

echo 'Git commit...'
cd public
git commit -a -m "Redeploying"

echo 'Push...'
git push origin gh-pages
