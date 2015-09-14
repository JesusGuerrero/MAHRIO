'use strict';

var User = require('mongoose').model('User'),
    adminUserMethods = require('./_adminFunctions');

module.exports = function ( config, server ) {

  server.auth.strategy('simple', 'bearer-access-token', {
    allowQueryToken: true,              // optional, true by default
    allowMultipleHeaders: false,        // optional, false by default
    accessTokenName: 'access_token',    // optional, 'access_token' by default
    validateFunc: function( token, callback ) {
      User.findOne({ authorizationToken: token}, function (err, user) {
        if (err || !user || typeof user === 'undefined') {
          return callback(null, false, { token: token });
        }
        callback(null, true, { token: token, role: user.role, id: user.id });
      });
    }
  });
  server.auth.strategy('session', 'cookie', {
    password: 'cookie_encryption_password',
    cookie: 'sessionid',
    redirectTo: false,
    isSecure: false,
    ttl: 30 * 24 * 60 * 60 * 1000 // 30 days
  });

  [
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
