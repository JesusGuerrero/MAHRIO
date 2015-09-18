angular.module('baseApp.directives')
  .directive('modalPrivateConversation', ['Chat','currentUser',
    function(Chat, currentUser){
      'use strict';
      return {
        restrict: 'E',
        templateUrl: '/assets/html/conversations/currentConversation',
        scope: {
          open: '@'
        },
        link: function(scope){
          scope.leftMessage = 'leftMessage';
          scope.rightMessage = 'rightMessage';
          scope.newMessage = '';
          scope.currentUser = currentUser.get();
          scope.isModal = true;
          var existingConversation = false;
          scope.sendMessage = function(){
            if( !existingConversation ) {
              Chat.startPrivateConversation( scope.toUser._id, { message: {content: scope.newMessage }} )
                .then( function( res ){
                  scope.currentConversation = res.conversation;
                  existingConversation = true;
                  delete scope.newMessage;
                });
            } else {
              Chat.sendPrivateMessage( scope.toUser._id, { content: scope.newMessage } )
                .then( function(res){
                  scope.currentConversation.messages.unshift( res.message );
                  delete scope.newMessage;
                });
            }
          };
          scope.$watch( 'open', function() {
            if( scope.open !== '0' ) {
              delete scope.currentConversation;
              scope.toUser = JSON.parse( scope.open );
              scope.otherUser = scope.toUser.profile ? (scope.toUser.profile.firstName + ' ' + scope.toUser.profile.lastName) : '';
              scope.otherUser += ' <'+scope.toUser.email+'>';
              Chat.getPrivateConversation( scope.toUser._id )
                .then( function(res){
                  if( res.conversation ) {
                    scope.currentConversation = res.conversation;
                    existingConversation = true;
                  } else {
                    scope.currentConversation = {
                      isPrivate: true
                    };
                  }

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