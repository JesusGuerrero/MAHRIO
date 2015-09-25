'use strict';

var userChatMethods = require('./_userFunctions');

module.exports = function(config, server) {
  userChatMethods.setConfig( config );
  [
    {
      method: ['GET'],
      path: '/api/chats/conversations/{action?}',
      config: {
        handler: function(request, reply){
          switch( request.params.action ){
            case 'public':
              return userChatMethods.getPublicConversation(request, reply);
            case 'private':
              return userChatMethods.getPrivateConversation( request, reply);
            default:
              return userChatMethods.getAllConversations( request, reply);
          }
        },
        auth: 'simple'
      }
    },
    {
      method: ['GET'],
      path: '/api/chats/messages/{id?}',
      config: {
        handler: function(request, reply){
          switch( typeof request.params.id ){
            case 'undefined':
              return userChatMethods.getMyLastMessages(request, reply);
            default:
              if( typeof request.query.private !== 'undefined' ) {
                return userChatMethods.getPrivateMessagesIn( request, reply);
              } else {
                return userChatMethods.getPublicMessagesIn( request, reply);
              }
          }
        },
        auth: 'simple'
      }
    },
    {
      method: ['POST'],
      path: '/api/chats/conversations/{action?}',
      config: {
        handler: function(request, reply){
          switch( request.params.action ){
            case 'public':
              return userChatMethods.postPublicConversation( request, reply);
            case 'private':
              return userChatMethods.postPrivateConversation( request, reply);
          }
        },
        auth: 'simple'
      }
    },
    {
      method: ['POST'],
      path: '/api/chats/messages/{action?}',
      config: {
        handler: function(request, reply){
          switch( request.params.action ){
            case 'private':
              return userChatMethods.sendPrivateMessage( request, reply);
            default:
              return userChatMethods.sendPublicMessage( request, reply );
          }
        },
        auth: 'simple'
      }
    }
  ].forEach(function (route) { server.route(route); });
};