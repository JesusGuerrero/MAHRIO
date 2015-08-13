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
          var existingConversation = false;
          scope.sendMessage = function(){
            if( !existingConversation ) {
              Chat.startPrivateConversation( scope.toUser._id, { message: {content: scope.newMessage }} )
                .then( function( res ){
                  scope.currentConversation = res.conversation;
                  delete scope.newMessage;
                });
            } else {
              Chat.sendPrivateMessage( scope.toUser._id, { content: scope.newMessage } )
                .then( function(res){
                  scope.currentConversation.messages.push( res.message );
                  //$('.direct-chat-messages', el).animate({
                  //  scrollTop: $('.direct-chat-messages')[0].scrollHeight
                  //}, 500);
                  delete scope.newMessage;
                });
            }
          };
          scope.$watch( 'open', function() {
            if( scope.open !== "0" ) {
              delete scope.currentConversation;
              scope.toUser = JSON.parse( scope.open );
              scope.otherUser = scope.toUser.profile ? (scope.toUser.profile.first_name + " " + scope.toUser.profile.last_name) : '';
              scope.otherUser += " <"+scope.toUser.email+">";
              Chat.getPrivateConversation( scope.toUser._id )
                .then( function(res){
                  if( res.conversation ) {
                    scope.currentConversation = res.conversation;
                    existingConversation = true;
                  } else {
                    scope.currentConversation = true;
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