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
                var lastMessage = item.messages.slice(-1);
                item.lastMessage = lastMessage[0];
                return item;
              });
              scope.conversations = res.conversations;
              console.log( scope.conversations );
              scope.conversation = scope.conversations.length ? scope.conversations[0] : [];
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
                var lastMessage = item.messages.slice(-1);
                item.lastMessage = lastMessage[0];
                return item;
              });
              scope.conversations = res.conversations;
              console.log( scope.conversations );
              scope.conversation = scope.conversations.length ? scope.conversations[0] : [];
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
  ]);