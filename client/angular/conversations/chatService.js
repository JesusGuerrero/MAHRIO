angular.module('baseApp.services')

.factory('ChatResource', [ '$resource', function($resource) {
  'use strict';
  // resource in [Messages, Conversations, Groups, Memberships, Users]
  return $resource('/api/chats/:resource/:id',
    { id: '@id', resource: '@resource' },
    {
      index: {
        method: 'GET'
      },
      get: {
        method: 'GET'
      },
      post: {
        method: 'POST'
      },
      put: {
        method: 'PUT'
      },
      remove: {
        method: 'DELETE'
      }
    }
  );
}])
.factory('Chat', [ 'ChatResource', function( ChatResource ) {
    'use strict';

    return {
      getConversations: function(){
        // Server: get (list)  all (last 10) where I am the receiver, initiator, or member
        return ChatResource.get({resource: 'conversations', id: 'all'}).$promise;
        // var conversationList = Conversations.find( myId == receiverId || myId == initiatorId )
        // forEach( conversationList, function(conversation) {
        //  if( (conversation.receiverId || conversation.initiatorId) && !conversation.groupId ) {
        //    // EITHER NOTES OR PRIVATE
        //    if( conversation.receiverId && conversation.initiatorId ) {
        //      conversation.type = private
        //      // PRIVATE, ONLY ONE OTHER USERS
        //      conversation.otherUser = getUser( myId !== conversation.initiatorId ? conversation.initiatorId : conversation.receiverId )
        //    } else {
        //      conversation.type = note
        //      // NOTES
        //    }
        //  } else {
        //    // EITHER PROTECTED OR PUBLIC, SET GROUP INFO
        //    conversation.group = getGroup( conversation.groupId )
        //    if( conversation.initiatorId && conversation.receiverId ) {
        //        conversation.type = protected
        //        // PROTECTED, ONLY ONE OTHER USER
        //        conversation.otherUser = getUser( myId !== conversation.initiatorId ? conversation.initiatorId : conversation.receiverId )
        //    } else {
        //        conversation.type = public
        //        // PUBLIC
        //        conversation.otherUsersArray = getMembershipsIn( conversations.groupId ).each( getUser( membership.userId ) )
        //    }
        //  }
        //  conversation.messages = getMessagesIn( conversation.id )
        //
        //  ------------------------------------------------------------------------------------------------------------
        // })
        /*
         conversation: {
           id: ?,
           initiatorId: REQUIRED,
           receiverId: OPT,
           groupId: OPT,
           otherUser: OPT,
           otherUsersArray: OPT,
           type: 0...3,
           messages: [],
           created: ?
         }
         */
      },
      getConversation: function( conversationId ) {
        // Server: get one where I am initiator, receiver, or member
        return ChatResource.get({resource: 'conversations', id: conversationId}).$promise;
      },
      getMessagesIn: function( conversationId ) {
        // Server: get (list) all (last 10) messages where I am a part of the conversation
        return ChatResource.get({resource:'messages', id: conversationId}).$promise;
      },
      getMemberships: function() {
        // Server: get (list) all (last 10) memberships that I belong to.
        return ChatResource.get({resource:'memberships'}).$promise;
      },
      getMembershipsIn: function( groupId ) {
        // Server: get (list) all (last 10) memberships that belong a group which I am a part of
        return ChatResource.get({resource:'memberships', id: groupId}).$promise;
      },
      getUsersIn: function( membershipId ) {
        return ChatResource.get({resource:'users', id: membershipId}).$promise;
      },
      getGroups: function() {
        return ChatResource.get({resource:'groups'}).$promise;
      },
      getConversationsIn: function( groupId ) {
        return ChatResource.get({resource:'conversations', id: groupId}).$promise;
      },
      sendMessage: function( conversationId, message ){
        return ChatResource.post({resource: 'messages', id: conversationId}, message).$promise;
      },
      startConversation: function( userId, message ){
        return ChatResource.post({resource: 'conversations', id: userId}, message).$promise;
      }
    };
}]);