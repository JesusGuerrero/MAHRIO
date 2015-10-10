angular.module('baseApp.directives')
  .directive('chatWidget', ['_','Chat','Socket','currentUser','Notification',
    function( _, Chat, Socket, currentUser, Notification ){
      'use strict';
      return {
        restrict: 'E',
        replace: true,
        templateUrl: '/assets/html/layout/header/_chatWidget',
        link: function(scope) {
          function populateMessageNotice(newConversations ){
            Chat.getAllPrivateConversations()
              .then( function(res){
                var conversations = _.indexBy( res.conversations, '_id');

                var newCount = 0;
                if( typeof newConversations === 'undefined') {
                  scope.notifications.chat = conversations;
                } else {
                  newCount = Object.keys(newConversations).length;
                  scope.notifications.chat = _.defaults( newConversations, conversations );
                }
                //console.log( scope.notifications.chat );
                scope.chat = {
                  total: newCount
                };
                //console.log( scope.chat );
              });
          }
          scope.$watch( currentUser.get, function(newUser){
            if( typeof newUser === 'undefined' ) {
              newUser = {access: ['any']};
            } else {

              Socket.get.on('event:notification:chat:'+newUser._id, function(){

                Notification.get()
                  .then( function(res){
                    populateMessageNotice(res.notifications.chat);
                  });
              });
            }
            scope.notifications = {
              chat: []
            };
            Notification.get()
              .then( function(res){
                populateMessageNotice(res.notifications.chat);
              });
          });
          scope.toggleNotification = function( $event, id ) {
            $event.stopPropagation();
            if( scope.notifications.chat[id].isNew ) {
              Notification.remove( id ).then( function(){
                scope.notifications.chat[id].isNew = false;
                scope.chat.total--;
              });
            } else {
              Notification.addChat( id ).then( function(){
                scope.chat.total++;
                scope.notifications.chat[id].isNew = true;
              });
            }


            console.log( id );
          };
        }
      };
    }
  ]);