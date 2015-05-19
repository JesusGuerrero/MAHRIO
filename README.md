# MAHRIO
  - MongoDB
  - AngularJS
  - Hapi
  - Raspberry Pi
  - Ionic
  - Oauth

This open-source projects aims at building a seed project with shared code between web and mobile app. It includes a server instance connected to a database along with token-based and Oauth authentication. The Raspberry Pi mini computer is to be determined.

##Instructions in Vagrant
 - Install Vagrant http://www.vagrantup.com
 - Install virtualbox http://www.virtualbox.org
 - Run the following command in the root directory of the project
 
`$vagrant up`

You now have a running Ubuntu Box with the MongoDB, NodeJS, and all NPM packages installed.

copy and rename `.env.dist` to `.env` in the same directory.  Modify the variables as needed.

Notice: Alternatively you can continue reading to setup the application manually.

## Versions
### Production
#### Linux-Box Specs
    OS: CentOS release 5.11 (Final)
    Architecture: 64-Bit (x86_64)
    Kernel: Linux version 2.6.32-042stab104.1
    CPU: 1.4 Ghz
    Cache: 2 Mb
    Memory: 1 Gb
    Storage: 60 Gb
#### Software Added
    Node v0.10.32 [http://nodejs.org/dist/v0.10.32/]
        - NPM v1.4.28
    MongoDB v2.6.8 [https://fastdl.mongodb.org/src/mongodb-src-r2.6.8.zip]
    Git v.1.7.0 [https://git-core.googlecode.com/files/git-1.7.9.tar.gz]
### Development
#### Jesus' MacBook Specs
    OS: OSX 10.10.2
    Architecture: 64-Bit
    CPU: 2.7 Ghz
    Cache: 4 Mb
    Memory: 4Gb
    Storage: 128 Gb
#### Software Added
    Node v.0.10.33
    MongoDB v2.6.5
    Git v1.9.3
## OSX Development - Software Installations
### Node
Check version installed

    $: node -v

Download and install

    http://nodejs.org/dist/v0.10.33/node-v0.10.33.pkg

Note: node comes with npm, to check npm version use

    $: npm -v

### MongoDB
Check version installed

    $: mongod --version

Install mongodb using brew

    http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/

### Git
Check version installed

    $: git --version

Install git using installer

    http://git-scm.com/downloads

## WebApp Setup and Run
### Checkout and Environment Setup
Clone git repository. On your operating system create a directory where this project will live and clone this repo.

    $: git clone https://github.com/JesusGuerrero/WebApp-HAM.git

Install global modules

    $: sudo npm install supervisor grunt bower -g

Install local application modules. Change into WebApp-HAM directory and ensure package.json is there. Then run command.

    $: npm install

You should now have a folder 'node_modules' next to the package.json, this are the modules required to run app.

### Run MongoDb
In order to leverage the database, ensure that mongod is running before the WebApp. To run mongod with custom config
ensure you are still in the directory, next to the package.json, and run startup the dameon using

    mongod --config mongoDB/config/mongod.conf

The configuration file is meant to have the data for development contained in your local workspace and the logs too.
This is never checked in, and ignored by .gitignore

### Run WebApp
Having the database running, and all the node_modules (including global) installed, you can run application by
using supervisor

    $: supervisor server/index.js

or by using node

    $: node server/index.js

Supervisor allows for monitoring changes to the code and auto-rebuilding for faster functional testing. Node on the
other hand can be configured in WebStorm and fully-debuggable with IDE

### Bower and Grunt
Bower is used to add new front-end libraries and keep track by using bower.json, so for example when any jquery plugins
needed you can log their requirement by installing via bower so that it gets saved to bower.json every time. When you
install in using bower you also need to update Gruntfile so that it takes the necessary files from bower package and
includes them in the build. This helps to keep libraries managed, and a task-runner to build the app is updated to any
new libraries. Some examples added through bower are angular, bootstrap and jquery.

Grunt is used to jslint any files modified, also copy from client to server folder, and finally build less files to css.

To run grunt watcher, ensure you are at the top-level next to the Gruntfile.json

    $: grunt

To run grunt once to build the system, ensure you are at the top-level next to the Gruntfile.json

    $: grunt build

### Run Tests
TODO, this is a work in progress but the basic setup is there. To run testing use

    $: grunt karma

and also

    npm test
## Notes - Things to consider

Node.JS changes frequently, and it's suggested you load the PPA in order to grab the stable latest version.  Work is in progress on customizing a Vagrantfile for this purpose, with instructions forthcoming.

## References
### Hapi [http://hapijs.com]
### AngularJS [https://angularjs.org]
### MongoDB [http://www.mongodb.org]

### Utilities
#### Back-End

    Jade [http://jade-lang.com]

#### Front-End

    Bootstrap 3.3.2 [http://getbootstrap.com]
    Font-Awesome 4.2.0 [http://fortawesome.github.io/Font-Awesome]
    jQuery 2.1.1 [http://jquery.com]
