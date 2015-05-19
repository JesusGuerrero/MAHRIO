#!/bin/bash -e
#
# bootstrap_node.sh - script run upon instance start up

echo "__________________STARTING bootstrap_node.sh_______________"

export DEBIAN_FRONTEND=noninteractive

# project path, usually /vagrant
if [ -z "$1" ]; then
  echo "\$project_path missing. [Usage] \$bootstrap_jesus_stack.sh [project_path]"
  exit -1
else
  echo "\$project_path = " "$1"
fi

echo -n "Updating source package lists          ... "
# update sources list
apt-get -qq update
echo "done"

echo -n "Checking utilities (npm)               ... "
# install some useful command line utilities as necessary
apt-get -qqy install curl git npm
echo "done"

echo -n "Downloading latest nodejs              ... "
curl -sL https://deb.nodesource.com/setup | sudo bash -
echo "done"

echo -n "Clearing previous installations        ... "
if [ -d "$1"/node_modules ]; then

	echo "$1"/node_modules exists

	rm -rf "$1/node_modules"
fi
echo "done"

echo -n "Installing latest nodejs               ... "
apt-get -qqy install nodejs
nodejs -v
echo "done"

