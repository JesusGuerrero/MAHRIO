'use strict';

var User = require('mongoose').model('User'),
    Boom = require('boom'),
    http = require('request'),
    authUserMethods = require('./_userFunctions'),
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
      method: ['GET'],
      path: '/api/oauth/linkedin',
      config: {
        handler: function (request, reply) {
          if( request.query.error && request.query.error === 'access_denied'){
            return reply.redirect('/app#login?error='+request.query.error );
          }
          /*jshint camelcase: false */
          var linkedIn = {
            oauth: {
              client_id: config.IN_CLIENT_ID,
              client_secret: config.IN_CLIENT_SECRET,
              redirect_uri: config.IN_CALLBACK_URL,
              grant_type: 'authorization_code',
              code: request.query.code
            },
            url: 'https://www.linkedin.com/uas/oauth2/accessToken'
          };

          http.post( {
            url: linkedIn.url,
            form: linkedIn.oauth
          }, function(err, httpResponse, body){
            var firstBody = body;
            http.get({
              url: 'https://api.linkedin.com/v1/people/~:(first-name,last-name,headline,location,industry,picture-url,email-address)?format=json',
              headers: {
                Authorization: 'Bearer ' + JSON.parse(firstBody).access_token
              }
            }, function(err, httpResponse, body) {
              try {
                reply({firstBody: JSON.parse(firstBody), secondBody: JSON.parse(body) });
              } catch(e){
                reply('FAILED');
              }
            });
          });
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
      path: '/api/oauth/facebook',
      config: {
        handler: function (request, reply) {
          if( request.query.error && request.query.error === 'access_denied'){
            return reply.redirect('/app#login?error='+request.query.error );
          }
          /*jshint camelcase: false */
          var facebook = {
            oauth: {
              client_id: config.FB_CLIENT_ID,
              client_secret: config.FB_CLIENT_SECRET,
              redirect_uri: config.FB_CALLBACK_URL,
              grant_type: 'authorization_code',
              code: request.query.code
            },
            url: 'https://graph.facebook.com/v2.3/oauth/access_token?'
          };

          http.get( {
            url: facebook.url,
            qs: facebook.oauth
          }, function(err, httpResponse, body){
            var firstBody = body;
            http.get({
              url: 'https://graph.facebook.com/v2.3/me?scope=email',
              headers: {
                Authorization: 'Bearer ' + JSON.parse(firstBody).access_token
              }
            }, function(err, httpResponse, body) {
              try {
                reply({firstBody: JSON.parse(firstBody), secondBody: JSON.parse(body) });
              } catch(e){
                reply('FAILED');
              }
            });
          });
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
      method: ['GET'],
      path: '/api/users/{action?}',
      config: {
        handler: function( request, reply ){
          switch( request.params.action ){
            case 'me':
              return authUserMethods.currentUser( request, reply, 'GET', 'firstName lastName email role created' );
            case 'all':
              return authUserMethods.getUsers( request, reply );
            default:
              var idInActionParameter = request.params.action;
              return authUserMethods.getUser( idInActionParameter, reply );
          }
        },
        auth: {
          strategy: 'simple'
        }
      }
    },
    {
      method: ['POST'],
      path: '/api/users/{action?}',
      config: {
        /*jshint maxcomplexity:10 */
        handler: function( request, reply ){
          switch( request.params.action ){
            case 'login':
              return authUserMethods.login( request, reply );
            case 'register':
              return authUserMethods.register( request, reply, server );
            case 'activate':
              return authUserMethods.activateUser( request, reply );
            case 'recoverPassword':
              return authUserMethods.recoverPassword( request, reply, server );
            case 'isValidToken':
              return authUserMethods.isValidToken( request, reply );
            case 'passwordReset':
              return authUserMethods.passwordReset( request, reply );
            case 'logout':
              return authUserMethods.logout( request, reply );
            default:
              return reply( Boom.badRequest() );
          }
        },
        auth: {
          mode: 'try',
          strategy: 'simple'
        }
      }
    },
    {
      method: ['PUT'],
      path: '/api/users/{action}',
      config: {
        handler: function( request, reply ){
          switch( request.params.action ){
            case 'me':
              return authUserMethods.currentUser( request, reply, 'PUT', 'firstName lastName email role salt password' );
            case 'other':
              return adminUserMethods.updateUser( request, reply );
          }
        },
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
