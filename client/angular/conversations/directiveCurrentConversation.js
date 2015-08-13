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
        link: function(scope, el){
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
                  scope.currentConversation.messages.push( res.message );
                  Socket.emit('event:ping', res.message);
                  $('.direct-chat-messages', el).animate({
                    scrollTop: $('.direct-chat-messages')[0].scrollHeight
                  }, 500);
                  delete scope.newMessage;
                });
            }
          };


          //Socket.on('event:pong', function(socket){
          //  console.log( socket );
          //  //if( conversations[ socket._conversation.id] ){
          //  //  conversations[ socket._conversation.id ][0].messages.unshift( socket );
          //  //}
          //  //if( socket._conversation.id === $scope.currentConversation.id ){
          //  //  $scope.currentConversation.messages.unshift(socket);
          //  //}
          //  //console.log('message: ' + socket.content);
          //});
        }
      };
    }
  ]);