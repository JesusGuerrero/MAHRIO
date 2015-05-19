angular.module('baseApp.directives')
  .directive('modalPrivateConversation', ['Chat',
    function(Chat){
      'use strict';
      return {
        restrict: 'E',
        replace: true,
        templateUrl: '/assets/html/conversations/modalPrivateConversation',
        link: function(scope){
          //console.log( attr.id );
          scope.messageSent = false;
          scope.message = '';
          scope.sendMessage = function(){
            //console.log( attr.id, scope, Chat );
            Chat.startConversation( scope.user._id, { message: scope.message } )
              .then( function(){
                scope.messageSent = true;
              });
          };
        }
      };
    }
  ]);