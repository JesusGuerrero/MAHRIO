angular.module('baseApp.directives')
  .directive('modalPrivateConversation', ['Chat','currentUser',
    function(Chat, currentUser){
      'use strict';
      return {
        restrict: 'E',
        templateUrl: '/assets/html/conversations/currentConversation',
        scope: {
          open: "@"
        },
        link: function(scope, el){
          scope.leftMessage = 'leftMessage';
          scope.rightMessage = 'rightMessage';
          scope.newMessage = '';
          scope.currentUser = currentUser.get();
          scope.sendMessage = function(){
            if( !scope.currentConversation ) {
              Chat.startPrivateConversation( scope.open, { message: {content: scope.newMessage }} )
                .then( function( res ){
                  scope.currentConversation = res.conversation;
                  delete scope.newMessage;
                });
            } else {
              Chat.sendPrivateMessage( scope.open, { content: scope.newMessage } )
                .then( function(res){
                  scope.currentConversation.messages.push( res.message );
                  $('.direct-chat-messages', el).animate({
                    scrollTop: $('.direct-chat-messages')[0].scrollHeight
                  }, 500);
                  delete scope.newMessage;
                });
            }
          };
          scope.$watch( 'open', function() {
            if( scope.open !== "0" ) {
              delete scope.currentConversation;
              Chat.getPrivateConversation( scope.open )
                .then( function(res){
                  scope.currentConversation = res.conversation;
                });
            }
          });
          scope.scrollBottom = function(){
            console.log('in here');
          };
        }
      };
    }
  ]);