angular.module('baseApp.controllers')
  .controller('ConversationsController', ['$scope', '$state',
    function ($scope, $state) {
      'use strict';

      $scope.tab = [false, false];
      switch( $state.current.name ) {
        case 'conversations.public':
          $scope.type = 'public';
          $scope.tab[0] = true;
          break;
        case 'conversations.private':
          $scope.type = 'private';
          $scope.tab[1] = true;
          break;
      }

      $scope.composeConversation = function(){
        $('#modalComposeConversation').modal().toggle();
      };
    }]);