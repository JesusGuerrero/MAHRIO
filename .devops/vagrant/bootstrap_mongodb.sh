#!/bin/bash -e
#
# bootstrap_node.sh - script run upon instance start up

echo "__________________STARTING bootstrap_mongodb.sh_______________"

echo -n "Adding MongoDB key entry               ... "
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
echo "done"

echo -n "Updating source package lists          ... "
# update sources list
apt-get -qq update
echo "done"

echo -n "Installing latest mongodb               ... "
apt-get install -y mongodb-org
echo "done"

