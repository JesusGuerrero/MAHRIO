'use strict';

var User = require('mongoose').model('User'),
    Boom = require('boom'),
    SessionCtrl = require('./_sessionFunctions');

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
      method: ['GET'],
      path: '/api/oauth/{party?}',
      config: {
        handler: function (request, reply) {
          SessionCtrl.loginThroughOauth(request, reply, request.params.party, config);
        }
      }
    },
    {
      method: ['GET'],
      path: '/api/oauth/linkedin/login',
      config: {
        handler: function (request, reply) {
          var linkedInUrl = 'https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=';
          linkedInUrl += config.IN_CLIENT_ID+'&redirect_uri=' + encodeURIComponent(config.IN_CALLBACK_URL);
          linkedInUrl += '&state=987654321&scope=r_basicprofile%20r_emailaddress';
          reply.redirect( linkedInUrl );
        }
      }
    },
    {
      method: ['GET'],
      path: '/api/oauth/facebook/login',
      handler: function( request, reply ){
        var facebookUrl = 'https://www.facebook.com/dialog/oauth?scope=email&client_id='+config.FB_CLIENT_ID;
        facebookUrl += '&redirect_uri='+encodeURIComponent(config.FB_CALLBACK_URL);
        reply.redirect( facebookUrl );
      }
    },
    {
      method: ['POST'],
      path: '/api/session/{action?}',
      config: {
        /*jshint maxcomplexity:10 */
        handler: function( request, reply ){
          switch( request.params.action ){
            case 'login':
              return SessionCtrl.login( request, reply );
            case 'recover-password':
              return SessionCtrl.recoverPassword( request, reply, config, server );
            case 'is-valid-token':
              return SessionCtrl.isValidToken( request, reply );
            case 'password-reset':
              return SessionCtrl.passwordReset( request, reply );
            case 'logout':
              return SessionCtrl.logout( request, reply );
            default:
              return reply( Boom.badRequest() );
          }
        }
      }
    }
  ]
  .forEach(function (route) { server.route(route); });
};
