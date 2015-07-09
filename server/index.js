'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.NODE_URL = process.env.NODE_URL || '127.0.0.1';

if (process.env.NODE_ENV === 'development') {
  require('node-env-file')('.env');
  console.log('Running Development!');
}

var config = require('./config/environments/variables.js')(process.env),
    server = require('./config/server/hapi.js')(config, process.env.NODE_URL );

// setup datastore
require('./config/storage/mongoose.js')(config, server);

// setup routes
require('./config/server/routes.js')(config, server);

// don't start server when testing
if (!module.parent || config.env === 'production') {
  server.start(function () {
    console.log('Server running at:', server.info.uri);
  });
}

module.exports = server;
