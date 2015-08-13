'use strict';

var User = require('mongoose').model('User'),
    Boom = require('boom'),
    UserCtrl = require('./_userFunctions'),
    adminUserMethods = require('./_adminFunctions');

module.exports = function ( config, server ) {
  [
    {
      method: ['GET'],
      path: '/api/users/{action?}',
      config: {
        handler: function( request, reply ){
          switch( request.params.action ){
            case 'me':
              return UserCtrl.currentUser( request, reply, 'GET', 'email access created avatarImage profile' );
            case 'all':
              return UserCtrl.getUsers( request, reply );
            default:
              var idInActionParameter = request.params.action;
              return UserCtrl.getUser( idInActionParameter, reply );
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
            case 'register':
              return UserCtrl.register( request, reply, config, server );
            case 'activate':
              return UserCtrl.activateUser( request, reply );
            case 'avatar':
              return UserCtrl.addAvatar( request, reply );
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
              return UserCtrl.currentUser( request, reply, 'PUT', 'firstName lastName email role salt password' );
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
