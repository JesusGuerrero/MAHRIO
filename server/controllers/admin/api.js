'use strict';

var adminUserMethods = require('./_adminFunctions');

module.exports = function ( config, server ) {
  [
    {
      method: ['PUT'],
      path: '/api/users/disable/{id?}',
      config: {
        handler: adminUserMethods.disableUser,
        auth: 'simple'
      }
    },
    {
      method: ['PUT'],
      path: '/api/admin/users/{id?}',
      config: {
        handler: adminUserMethods.makeAdmin,
        auth: 'simple'
      }
    },
    {
      method: ['DELETE'],
      path: '/api/admin/users/{id?}',
      config: {
        handler: adminUserMethods.removeAdmin,
        auth: 'simple'
      }
    },
    {
      method: ['DELETE'],
      path: '/api/users/{id?}',
      config: {
        handler: adminUserMethods.removeUser,
        auth: 'simple'
      }
    }
  ]
  .forEach(function (route) { server.route(route); });
};
