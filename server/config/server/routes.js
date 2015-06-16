'use strict';

var getData = require('request');

module.exports = function (config, server) {

  function getNavigation( ){
    var defer = require('q').defer();
    getData({
      url: config.cmsURL + '/taxonomies',
      json: true
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        return defer.resolve( body.nodes );
      }else{
        return defer.reject( [] );
      }
    });
    return defer.promise;
  }

/*  server.utils = {
    getNav: getNavigation
  };*/
  server.lang = config.lang.get();

  require('../../controllers/authentication/api')(config, server);

  require('../../controllers/knowledge')(config, server);
  require('../../controllers/calendar/api')(config, server);
  require('../../controllers/contact')(config, server);

  require('../../controllers/chat/api')(config, server);

  require('../../controllers/cms')(config, server);

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
    path: '/favicon.ico',
    handler: {
      file: 'img/favicon.ico'
    }
  });

  // SEO-FRIENDLY URL ROUTES
  var notDefined;
  server.route({
    method: 'GET',
    path: '/{page?}',
    handler: function(request, reply){
      switch( request.params.page ){
        case notDefined:
          reply.view('_adminLTE', {
            page: null,
            navigation: ['Information Technology'],
            lang: server.lang
          });
          break;
        case 'questions':
          reply.view('_adminLTE', {
            page: 'questions',
            navigation: ['Information Technology'],
            lang: server.lang
          });
          break;
        case 'adminLTE':
          reply.view('_adminLTE');
          break;
        default:
          reply.view('_adminLTE', {
            page: 'notFound',
            navigation: ['Information Technology'],
            lang: server.lang
          });
          break;
      }

    }
  });

  // WebApp - Single Page
  server.route({
    method: 'GET',
    path: '/app',
    handler: function(request, reply){
      reply.view('_app', {
        navigation: ['Information Technology'],
        lang: server.lang
      });
    }
  });

  server.route({
    method: 'OPTIONS',
    path: '/{path*}',
    handler: function(request, reply) {
      reply();
    }
  });


  return server;
};
