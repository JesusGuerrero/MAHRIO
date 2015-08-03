'use strict';

var BoardCtrl = require('./_boardFunctions');

module.exports = function(config, server) {
  [
    {
      method: ['GET'],
      path: '/api/boards/{id?}',
      config: {
        handler: BoardCtrl.get,
        auth: 'simple'
      }
    },
    {
      method: ['POST'],
      path: '/api/boards',
      config: {
        handler: BoardCtrl.create,
        auth: 'simple'
      }
    },
    {
      method: ['PUT'],
      path: '/api/boards/{id?}',
      config: {
        handler: BoardCtrl.update,
        auth: 'simple'
      }
    },
    {
      method: ['DELETE'],
      path: '/api/boards/{id?}',
      config: {
        handler: BoardCtrl.remove,
        auth: 'simple'
      }
    }
  ].forEach(function (route) { server.route(route); });
};