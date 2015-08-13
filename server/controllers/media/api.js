'use strict';

var MediaCtrl = require('./_mediaFunctions');

module.exports = function(config, server) {
  [
    {
      method: ['GET'],
      path: '/api/media/{id?}',
      config: {
        handler: function( req, rep ){
          if( req.params.id === 'key' ) {
            return MediaCtrl.getKey( req, rep, config );
          } else {
            return MediaCtrl.get( req, rep );
          }
        },
        auth: 'simple'
      }
    },
    {
      method: ['POST'],
      path: '/api/media',
      config: {
        handler: MediaCtrl.create,
        auth: 'simple'
      }
    },
    {
      method: ['DELETE'],
      path: '/api/media/{id?}',
      config: {
        handler: MediaCtrl.remove,
        auth: 'simple'
      }
    }
  ].forEach(function (route) { server.route(route); });
};