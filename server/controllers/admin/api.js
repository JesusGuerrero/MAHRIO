'use strict';

var adminUserMethods = require('./_adminFunctions');

module.exports = function ( config, server ) {
  [
    {
      method: ['PUT'],
      path: '/api/users/disable/{id?}',
      config: {
        handler: adminUserMethods.disableUser,
        auth: {
          strategy: 'simple'
        }
      }
    },
    {
      method: ['DELETE'],
      path: '/api/users/{id?}',
      config: {
        handler: adminUserMethods.removeUser,
        auth: {
          strategy: 'simple'
        }
      }
    }
  ]
  .forEach(function (route) { server.route(route); });
};
