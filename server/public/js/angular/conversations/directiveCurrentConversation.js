angular.module('baseApp.directives')
  .directive('currentConversation', ['currentUser','Socket','Chat','_',
    function(currentUser, Socket, Chat, _){
      'use strict';
      return {
        restrict: 'E',
        scope: {
          current: '=',
          private: '='
        },
        templateUrl: '/assets/html/conversations/currentConversation',
        link: function(scope){
          scope.currentUser = currentUser.get();
          scope.currentConversations = [];
          scope.leftMessage = 'leftMessage';
          scope.rightMessage = 'rightMessage';
          scope.$watch( 'current', function(){
            if( scope.current ) {
              scope.currentConversation = scope.current;
            }
          });

          scope.sendMessage = function(){
            if( scope.private ) {
              var otherUser = _.find( Object.keys(scope.currentConversation.members), function(item){
                return item !== scope.currentUser._id;
              });
              Chat.sendPrivateMessage( otherUser, { content: scope.newMessage } )
                .then( function(res){
                  scope.currentConversation.messages.unshift( res.message );
                  delete scope.newMessage;
                });
            } else {
              Chat.sendPublicMessage( scope.currentConversation._id, { content: scope.newMessage } )
                .then( function(res){
                  scope.currentConversation.messages.unshift( res.message );
                  delete scope.newMessage;
                });
            }
          };
        }
      };
    }
  ]);