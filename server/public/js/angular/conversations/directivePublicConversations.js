angular.module('baseApp.directives')
  .directive('publicConversations', ['Chat','_',
    function(Chat, _){
      'use strict';
      return {
        restrict: 'E',
        replace: true,
        templateUrl: '/assets/html/conversations/directiveConversations',
        scope: {
          active: '='
        },
        link: function(scope){
          if( scope.active ){
            Chat.getAllPublicConversations().then(function (res) {
              _.map( res.conversations, function(item){
                var lastMessage = item.messages[0];
                item.lastMessage = lastMessage;
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
        templateUrl: '/assets/html/conversations/directiveConversations',
        scope: {
          active: '='
        },
        link: function(scope){
          if( scope.active ) {

            Chat.getAllPrivateConversations().then(function (res) {
              _.map(res.conversations, function (item) {
                var lastMessage = item.messages[0];
                item.lastMessage = lastMessage;
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
  .directive('allConversations', ['Chat','_',
    function(Chat, _){
      'use strict';
      return {
        restrict: 'E',
        replace: true,
        templateUrl: '/assets/html/conversations/directiveConversations',
        scope: {
          active: '='
        },
        link: function(scope){
          if( scope.active ) {

            Chat.getAllConversations().then(function (res) {
              if( res.conversations && res.conversations.length ) {
                _.map(res.conversations, function (item) {
                  var lastMessage = item.messages[0];
                  item.lastMessage = lastMessage;
                  return item;
                });
                scope.conversations = res.conversations;
                scope.conversation = scope.conversations.length ? scope.conversations[0] : null;
                scope.isPrivate = scope.conversation.isPrivate;
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