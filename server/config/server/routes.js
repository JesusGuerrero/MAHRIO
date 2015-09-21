'use strict';

function requireControllers(config, server){
  require('../../controllers/oauth/api')(config, server);
  require('../../controllers/user/api')(config, server);
  require('../../controllers/profile/api')(config, server);
  require('../../controllers/article/api')(config, server);
  require('../../controllers/autocomplete/api')(config, server);
  require('../../controllers/board/api')( config, server );
  require('../../controllers/calendar/api')(config, server);
  require('../../controllers/chat/api')(config, server);
  require('../../controllers/notification/api')(config, server);
  require('../../controllers/mail/api')(config, server);
  require('../../controllers/media/api')(config, server);
  require('../../controllers/network/api')(config, server);
  require('../../controllers/task/api')(config, server);
  require('../../controllers/contact/newsletter')(config, server);
  require('../../controllers/contact/knowledge')(config, server);
}
module.exports = function (config, server) {

  server.lang = config.lang.get();

  requireControllers(config, server);

  /* ASSETS & TEMPLATES */
  server.route({
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
      directory: {
        path: '../public',
        defaultExtension: 'html'
      }
    }
  });
  server.route({
    method: 'GET',
    path: '/template/{param*}',
    handler: {
      directory: {
        path: '../public/html/templates',
        defaultExtension: 'html'
      }
    }
  });

  /* FAVICON */
  server.route({
    method: 'GET',
    path: '/favicon.ico',
    handler: {
      file: 'img/favicon.ico'
    }
  });

  // MAIN ROUTER
  var notDefined;
  server.route({
    method: 'GET',
    path: '/{page?}',
    handler: function(request, reply){
      switch( request.params.page ){
        case notDefined:
          reply.view('_mahrio', {
            develop: request.query.develop
          });
          break;
        default:
          reply.view('pages/_notFound');
          break;
      }
    }
  });

  // ACCEPT ALL OPTIONS
  server.route({
    method: 'OPTIONS',
    path: '/{path*}',
    handler: function(request, reply) {
      reply();
    }
  });

  return server;
};
