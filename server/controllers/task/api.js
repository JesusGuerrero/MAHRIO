'use strict';

var TaskCtrl = require('./_taskFunctions');

module.exports = function(config, server) {
  [
    //{
    //  method: ['GET'],
    //  path: '/api/tasks/board/{id?}',
    //  config: {
    //    handler: TaskCtrl.getFromBoard,
    //    auth: 'simple'
    //  }
    //},
    //{
    //  method: ['GET'],
    //  path: '/api/tasks/{id?}',
    //  config: {
    //    handler: TaskCtrl.get,
    //    auth: 'simple'
    //  }
    //},
    {
      method: ['POST'],
      path: '/api/tasks/{boardId?}',
      config: {
        handler: TaskCtrl.create,
        auth: 'simple'
      }
    },
    {
      method: ['PUT'],
      path: '/api/tasks/start/{id?}',
      config: {
        handler: TaskCtrl.start,
        auth: 'simple'
      }
    },
    {
      method: ['PUT'],
      path: '/api/tasks/{id?}',
      config: {
        handler: TaskCtrl.update,
        auth: 'simple'
      }
    },
    {
      method: 'GET',
      path: '/api/tasks/{boardId?}',
      config: {
        handler: TaskCtrl.get,
        auth: 'simple'
      }
    }
  ].forEach(function (route) { server.route(route); });
};