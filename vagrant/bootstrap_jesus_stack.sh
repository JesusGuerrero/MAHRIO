#!/bin/bash -e
#
# bootstrap_jesus_stack.sh - script run upon instance start up

echo "__________________STARTING bootstrap_jesus_stack.sh_______________"

export DEBIAN_FRONTEND=noninteractive

# project path, usually /vagrant
if [ -z "$1" ]; then
  echo "\$project_path missing. [Usage] \$bootstrap_jesus_stack.sh [project_path]"
  exit -1
else
  echo "\$project_path = " "$1"
fi

echo -n "Installing project stack                ... "
cd "$1"
sudo npm install
echo "done"

echo -n "Utilizing custom config for MongoDB 	 ... "
cd "$1"
mongod --config mongoDB/config/mongod.conf
echo "done"

#echo -n "Starting the Jesus Stack via Supervisor ... "
#cd "$1"
#supervisor server/index.js &
#echo "done"

