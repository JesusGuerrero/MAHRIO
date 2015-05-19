'use strict';

var Boom = require('boom');

module.exports = function(config, server){
  [
    {
      method: ['GET'],
      path: '/admin/cms/session',
      config: {
        handler: function(request, reply){
          if( request.auth.credentials.role !== 'admin' ) {
            return reply( Boom.unauthorized('unauthorized'));
          }

          request.auth.session.set( request.auth.credentials );
          reply();
        },
        auth: 'simple'
      }

    },
    {
      method: ['GET'],
      path: '/admin/cms',
      config: {
        handler: function(request, reply){
          if( request.auth.isAuthenticated ){
            //return reply.view('cms/_index');
          }
          reply.view('cms/_index', {
            lang: server.lang,
            cmsUrl: config.CMS_URL
          });
//          reply('NOT AUTHENTIC!');
        },
        auth: {
          mode: 'try',
          strategy: 'session'
        }
      }

    }
  ]
  .forEach( function(route){ server.route( route ); });
};