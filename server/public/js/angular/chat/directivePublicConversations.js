angular.module('baseApp.directives')
  .directive('publicConversations', ['Chat','_',
    function(Chat, _){
      'use strict';
      return {
        restrict: 'E',
        replace: true,
        templateUrl: '/assets/html/chat/directiveConversations',
        scope: {
          active: '='
        },
        link: function(scope){
          if( scope.active ){
            Chat.getAllPublicConversations().then(function (res) {
              _.map(res.conversations, function (item) {
                var lastMessage = item.messages[0];
                item.lastMessage = lastMessage;
                item.totalUsers = Object.keys( item.members).length;
                return item;
              });
              scope.conversations = res.conversations;
              scope.conversation = scope.conversations.length ? scope.conversations[0] : null;
              scope.isPrivate = false;
            });
            scope.load = function(id){
              scope.conversation = _.findWhere( scope.conversations, {_id: id});
              scope.isPrivate = false;
            };
          }
        }
      };
    }
  ])
  .directive('privateConversations', ['Chat','_',
    function(Chat, _){
      'use strict';
      return {
        restrict: 'E',
        replace: true,
        templateUrl: '/assets/html/chat/directiveConversations',
        scope: {
          active: '='
        },
        link: function(scope){
          if( scope.active ) {
            Chat.getAllPrivateConversations().then(function (res) {
              _.map(res.conversations, function (item) {
                var lastMessage = item.messages[0];
                item.lastMessage = lastMessage;
                item.totalUsers = Object.keys( item.members).length;
                return item;
              });
              scope.conversations = res.conversations;
              scope.conversation = scope.conversations.length ? scope.conversations[0] : null;
              scope.isPrivate = true;
            });
            scope.load = function (id) {
              scope.conversation = _.findWhere(scope.conversations, {_id: id});
              scope.isPrivate = true;
            };
          }
        }
      };
    }
  ])
  .directive('allConversations', ['Chat','_','$state','currentUser',
    function(Chat, _, $state, currentUser ){
      'use strict';
      return {
        restrict: 'E',
        replace: true,
        templateUrl: '/assets/html/chat/directiveConversations',
        scope: {
          active: '='
        },
        link: function(scope){
          if( scope.active ) {
            var current = $state.params.id;
            Chat.getAllConversations().then(function (res) {
              if( res.conversations && res.conversations.length ) {
                _.map(res.conversations, function (item) {
                  var lastMessage = item.messages[0];
                  item.lastMessage = lastMessage;
                  item.totalUsers = Object.keys( item.members).length;
                  return item;
                });
                scope.conversations = _.indexBy( res.conversations, '_id');
                if( scope.conversations ) {
                  scope.hasConversations = Object.keys( scope.conversations).length;
                } else {
                  scope.hasConversations = false;
                }

                if( typeof current !== 'undefined' && current !== ''){
                  if( scope.conversations.hasOwnProperty( current ) ) {
                    scope.conversation = scope.conversations[ current ];
                    scope.isPrivate = scope.conversation.isPrivate;
                  } else {
                    Chat.getConversation( current )
                      .then( function(res){
                        console.log( currentUser );
                        scope.conversation = res.conversation;
                        scope.isPrivate = scope.conversation.isPrivate;
                      });
                  }
                } else {
                  if( res.conversations.length ) {
                    $state.go( 'conversations.view', {id: res.conversations[0]._id}, {reload: true});
                  }
                }
              }
            });
            scope.load = function (id) {
              scope.conversation = _.findWhere(scope.conversations, {_id: id});
              scope.isPrivate = scope.conversation.isPrivate;
            };
          }
        }
      };
    }
  ]);