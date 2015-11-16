'use strict';

module.exports = function(config, server) {
  [
    {
      method: ['GET'],
      path: '/api/sockets',
      config: {
        handler: function(response, reply) {
          if( typeof config !== 'undefined') {
            var socket = config.getSocket();
            socket.emit( 'event:testing', { hello: 'World!' } );
            socket.broadcast.emit( 'event:testing' );
          }
          reply( { resolve: true} );

        },
        auth: 'simple'
      }
    }
  ].forEach(function (route) { server.route(route); });
};