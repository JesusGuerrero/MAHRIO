'use strict';

var Hapi = require('hapi'),
    Path = require('path'),
    SocketIO = require('socket.io'),
    Socket;

var server = new Hapi.Server();

module.exports = function (config, url) {
  var logError = function (err) { if (err) { console.error(err); }};

  var options = {
    opsInterval: 1000,
    reporters: [{
      reporter: require('good-console'),
      events: { log: '*', response: '*' }
    }]
  };


  var SocketHandler = function(socket){
    console.log( 'sockets listening' );
    socket.emit('welcome', {
      message: 'Hello from Hapi!'
    });
    var messageHandler = function( data ){
      console.log( 'We got pinged: ' + data );
      socket.broadcast.emit('event:pong', data);
      console.log( 'We emitted pong: '+ data );
    };

    socket.on('event:ping', messageHandler );
  };

  var serverConfig = {
    port: config.port,
    routes: {
      files: {
        relativeTo: Path.join(config.rootPath, 'public')
      },
      cors: {
        origin: ['*'],
        matchOrigin: true,
        headers: ['Authorization','Content-type'],
        additionalExposedHeaders: ['Authorization']
      }
    }
  };
  if( config.env !== 'production') {
    serverConfig.host = url;
  }
  server.connection( serverConfig );

  server.sendEmail = require('../email/setup');

  server.register({
      register: require('good'),
      options: options
    },
    function (err) {
      if (err) {
        console.error(err);
      }
      else {
        /*server.start(function () {
          console.info('Server started at ' + server.info.uri);
          Socket = SocketIO.listen( server.listener );
          Socket.on('connection', SocketHandler);
        });*/
      }
    }
  );

  server.register(require('hapi-auth-bearer-token'), logError);
  server.register(require('hapi-auth-cookie'), logError);

  server.register(require('bell'), logError);

  server.views({
    engines: {
      jade: require('jade')
    },
    path: Path.join(__dirname, '../../views')
  });

  return server;
};
