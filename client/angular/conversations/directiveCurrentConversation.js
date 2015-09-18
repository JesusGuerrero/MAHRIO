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
        templateUrl: '/assets/html/conversations/currentConversation',
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
                //var processResponse = function(res) {
                //  var messages = scope.currentConversation.messages,
                //    hasMissingUser = false;
                //  angular.forEach( res.messages, function(item){
                //    if( typeof scope.currentConversation.members[ item._user ] === 'undefined') {
                //      hasMissingUser = true;
                //    }
                //    messages.unshift( item );
                //  });
                //  if( hasMissingUser ) {
                //    $state.reload();
                //  } else {
                //    scope.currentConversation.messages = messages;
                //  }
                //};
                //if( scope.private ) {
                //  Chat.getPrivateMessagesIn( scope.currentConversation._id, scope.currentConversation.messages[0].created )
                //    .then( processResponse );
                //} else {
                //  Chat.getPublicMessagesIn( scope.currentConversation._id, scope.currentConversation.messages[0].created )
                //    .then( processResponse );
                //}

              });
            }
          });

          scope.sendMessage = function(){
            if( scope.private ) {
              var otherUser = _.find( Object.keys(scope.currentConversation.members), function(item){
                return item !== scope.currentUser._id;
              });
              Chat.sendPrivateMessage( otherUser, { content: scope.newMessage } )
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