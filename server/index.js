'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
if (process.env.NODE_ENV === 'development') {
  require('node-env-file')('.env');
  console.log('Running Development!');
}
process.env.NODE_URL = process.env.NODE_URL || '127.0.0.1';

console.log( process.env.NODE_URL );
var config = require('./config/environments/variables.js')(process.env),
    server = require('./config/server/hapi.js')(config, process.env.NODE_URL );

// setup datastore
require('./config/storage/mongoose.js')(config, server);

// setup routes
require('./config/server/routes.js')(config, server);

server.route({
  method: 'POST',
  path: '/restroom-update',
  handler: function(request, reply) {
    console.log( 'handling socket' );
    var socket = config.getSocket();
    console.log( socket );
    socket.emit('event:restroom', request.query.signal);
    socket.broadcast.emit('event:restroom', request.query.signal);
    reply({ok: true});
  }
});

// don't start server when testing
if (!module.parent || config.env === 'production') {
  server.start(function () {
    console.log('Server running at:', server.info.uri);
  });
}

module.exports = server;
