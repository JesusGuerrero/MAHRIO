'use strict';

var NetworkCtrl = require('./_networkFunctions');

module.exports = function(config, server) {
  [
    {
      method: ['GET'],
      path: '/api/networks/{id?}',
      config: {
        handler: NetworkCtrl.read,
        auth: 'simple'
      }
    },
    {
      method: ['POST'],
      path: '/api/networks',
      config: {
        handler: NetworkCtrl.create,
        auth: 'simple'
      }
    },
    {
      method: ['PUT'],
      path: '/api/networks/{id}/admin',
      config: {
        handler: NetworkCtrl.admin,
        auth: 'simple'
      }
    },
    {
      method: ['PUT'],
      path: '/api/networks/{id}/join',
      config: {
        handler: NetworkCtrl.join,
        auth: 'simple'
      }
    },
    {
      method: ['PUT'],
      path: '/api/networks/{id}/leave',
      config: {
        handler: NetworkCtrl.leave,
        auth: 'simple'
      }
    },
    {
      method: ['PUT'],
      path: '/api/networks/{id}',
      config: {
        handler: NetworkCtrl.update,
        auth: 'simple'
      }
    },
    {
      method: ['DELETE'],
      path: '/api/networks/{id?}',
      config: {
        handler: NetworkCtrl.remove,
        auth: 'simple'
      }
    }
  ].forEach(function (route) { server.route(route); });
};