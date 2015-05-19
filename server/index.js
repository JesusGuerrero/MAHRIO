'use strict';

require('node-env-file')('.env');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.NODE_PORT = process.env.NODE_PORT || '8042';

var config = require('./config/environments/variables.js')(process.env),
    server = require('./config/server/hapi.js')(config, process.env.NODE_URL );

// setup datastore
require('./config/storage/mongoose.js')(config, server);

// setup routes
require('./config/server/routes.js')(config, server);

// don't start server when testing
if (!module.parent) {
  server.start(function () {
    console.log('Server running at:', server.info.uri);
  });
}

module.exports = server;
