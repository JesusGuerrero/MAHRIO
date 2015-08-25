'use strict';

var ProfileCtrl = require('./_profileFunctions');

module.exports = function(config, server) {
  [
    {
      method: ['GET'],
      path: '/api/profile/{id?}',
      config: {
        handler: ProfileCtrl.get,
        auth: 'simple'
      }
    },
    {
      method: ['PUT'],
      path: '/api/profile/{id?}',
      config: {
        handler: ProfileCtrl.update,
        auth: 'simple'
      }
    }
  ].forEach(function (route) { server.route(route); });
};