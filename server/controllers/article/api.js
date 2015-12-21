'use strict';

var ArticleCtrl = require('./_articleFunctions');

module.exports = function(config, server) {
  [
    {
      method: ['GET'],
      path: '/article/{link?}',
      config: {
        handler: ArticleCtrl.get
      }
    },
    {
      method: ['GET'],
      path: '/api/articles/{id?}',
      config: {
        handler: ArticleCtrl.get
      }
    },
    {
      method: ['POST'],
      path: '/api/articles',
      config: {
        handler: ArticleCtrl.create,
        auth: 'simple'
      }
    },
    {
      method: ['PUT'],
      path: '/api/articles/{id?}',
      config: {
        handler: ArticleCtrl.update,
        auth: 'simple'
      }
    },
    {
      method: ['DELETE'],
      path: '/api/articles/{id?}',
      config: {
        handler: ArticleCtrl.remove,
        auth: 'simple'
      }
    }
  ].forEach(function (route) { server.route(route); });
};