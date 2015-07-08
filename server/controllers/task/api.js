'use strict';

var TaskCtrl = require('./_taskFunctions');

module.exports = function(config, server) {
  [
    {
      method: ['GET'],
      path: '/api/tasks/{id?}',
      config: {
        handler: TaskCtrl.get,
        auth: 'simple'
      }
    },
    {
      method: ['POST'],
      path: '/api/tasks',
      config: {
        handler: TaskCtrl.create,
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
    }
  ].forEach(function (route) { server.route(route); });
};