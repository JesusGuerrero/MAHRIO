angular.module('baseApp.directives')
  .directive('currentConversation', ['currentUser','Socket','Chat','_','$state',
    function(currentUser, Socket, Chat, _, $state){
      'use strict';
      return {
        restrict: 'E',
        scope: {
          current: '=',
          private: '='
        },
        templateUrl: '/assets/html/chat/currentConversation',
        link: function(scope){
          scope.currentUser = currentUser.get();
          scope.currentConversations = [];
          scope.leftMessage = 'leftMessage';
          scope.rightMessage = 'rightMessage';
          scope.$watch( 'current', function(){
            if( scope.current ) {
              scope.currentConversation = scope.current;
              Socket.get.on('event:conversation:'+scope.currentConversation._id, function(){
                $state.reload();
              });
            }
          });

          scope.sendMessage = function(){
            if( scope.private ) {
              Chat.sendPrivateMessage( scope.currentConversation._id, { content: scope.newMessage }, Object.keys(scope.currentConversation.members) )
                .then( function(){
                  delete scope.newMessage;
                });
            } else {
              Chat.sendPublicMessage( scope.currentConversation._id, { content: scope.newMessage } )
                .then( function(){
                  if( typeof scope.currentConversation.members[ currentUser.get()._id ] === 'undefined' ) {
                    scope.currentConversation.members[ currentUser.get()._id ] = currentUser.get();
                  }
                  delete scope.newMessage;
                });
            }
          };
        }
      };
    }
  ]);