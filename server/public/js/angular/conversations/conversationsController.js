angular.module('baseApp.controllers')
  .controller('ConversationsController', ['$scope', '$state','Socket',
    function ($scope, $state) {
      'use strict';

      $scope.tab = [false, false];
      switch( $state.current.name ) {
        case 'conversations.public':
          $scope.tab[0] = true;
          break;
        case 'conversations.private':
          $scope.tab[1] = true;
          break;
      }
      //
      //var conversations;
      //$scope.conversationList = [];
      //$scope.currentConversation = {};
      //$scope.newMessage = '';
      //
      //Chat.getConversations()
      //  .then( function( res ) {
      //    var keys = Object.keys( res.conversations );
      //    if( keys.length ){
      //      conversations = angular.copy( res.conversations );
      //      conversations = $scope
      //        ._( conversations )
      //        .groupBy( function(item){ return item._id; });
      //
      //      $scope.conversationList = angular.copy( res.conversations );
      //
      //      $scope.currentConversation = res.conversations[0];
      //      $scope.currentConversation.currentMembers = $scope
      //        ._( $scope.currentConversation.members )
      //        .reduce( function(member, val) {
      //          return member[0].email  + ', ' + val[0].email;
      //        });
      //
      //      $scope.currentUser = res.currentUser;
      //      $scope
      //        ._( $scope.conversationList )
      //        .map( function(item ){
      //          var members = $scope
      //            ._( item.members )
      //            .reduce( function(member, val) {
      //              return member[0].email  + ', ' + val[0].email;
      //            });
      //          console.log( members );
      //          item.lastMessage = item.messages.length ? item.messages[0].content : '';
      //          item.members = members;
      //          delete item.messages;
      //          return item;
      //        });
      //    }
      //  });
      //
      //$scope.sendMessage = function(){
      //  Chat.sendMessage( $scope.currentConversation._id, { message: $scope.newMessage } )
      //    .then( function(res){
      //      Socket.emit('event:ping', res.message);
      //      $scope.currentConversation.messages.unshift(res.message);
      //      $scope.newMessage = '';
      //    });
      //};
      //
      //$scope.loadConversation = function(id){
      //  $scope.currentConversation = conversations[ id ][0];
      //  $scope.currentConversation.currentMembers = $scope
      //    ._( $scope.currentConversation.members )
      //    .reduce( function(member, val) {
      //      return member[0].email  + ', ' + val[0].email;
      //    });
      //};
    }]);