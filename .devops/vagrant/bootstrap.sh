#!/bin/bash -e
#
# bootstrap.sh - script run upon instance start up

echo "__________________STARTING bootstrap.sh_______________"

echo -n "Updating source package lists          ... "
# update sources list
apt-get -qq update
echo "done"

echo -n "Checking utilities                     ... "
# install some useful command line utilities as necessary
apt-get -qqy install nfs-common portmap
echo "done"
