'use strict';

function requireControllers(config, server){

  require('../../controllers/oauth/api')(config, server);
  require('../../controllers/billing/api')(config, server);
  require('../../controllers/admin/api')(config, server);
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
  require('../../controllers/contact/api')(config, server);
  //require('../../controllers/contact/newsletter')(config, server);
  //require('../../controllers/contact/knowledge')(config, server);
  require('../../controllers/socket/api')(config, server);
  require('../../controllers/hardware/api')(config, server);
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
  server.route({
    method: 'GET',
    path: '/',
    handler: {
      file: '../public/static/home.html'
    }
  });
  server.route({
    method: 'GET',
    path: '/app',
    handler: function(request, reply) {
      reply.view('_mahrio', {
        develop: request.query.develop
      });
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
