'use strict';

var autoComplete = require('./autocompleteFunction'),
    Boom = require('boom');

module.exports = function(config, server) {
  server.route( {
      method: ['GET'],
      path: '/api/autocomplete/{action?}',
      config: {
        handler: function(request, reply){
          switch( request.params.action ){
            case 'users':
              return autoComplete.get( 'users', request.query.q, reply );
            default:
              return reply( Boom.badRequest() );
          }
        }
      }
    });
};