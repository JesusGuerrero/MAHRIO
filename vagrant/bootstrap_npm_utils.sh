#!/bin/bash -e
#
# bootstrap_npm_util.sh - script run upon instance start up

echo "__________________STARTING bootstrap_npm_utils.sh_______________"

echo -n "Installing utilities (npm)               ... "
# install some useful command line utilities as necessary
npm install supervisor grunt bower -g
echo "done"


