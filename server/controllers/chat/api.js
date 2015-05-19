'use strict';

var userChatMethods = require('./_userFunctions');

module.exports = function(config, server) {
  [
    {
      method: ['GET'],
      path: '/api/chats/conversations/{action?}',
      config: {
        handler: function(request, reply){
          switch( request.params.action ){
            case 'all':
              return userChatMethods.getConversations(request, reply);
            default:
              var idInActionParameter = request.params.action ? request.params.action : null;
              return userChatMethods.getOneConversation( idInActionParameter, reply );
          }
        },
        auth: 'simple'
      }
    },
    {
      method: ['POST'],
      path: '/api/chats/conversations/{userId}',
      config: {
        handler: userChatMethods.postConversation,
        auth: 'simple'
      }
    },
    {
      method: ['POST'],
      path: '/api/chats/messages/{conversationId}',
      config: {
        handler: userChatMethods.sendMessage,
        auth: 'simple'
      }
    }
  ].forEach(function (route) { server.route(route); });
};