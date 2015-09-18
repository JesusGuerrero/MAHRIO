angular.module('baseApp.controllers')
  .controller('ConversationsController', ['$scope', '$state',
    function ($scope, $state) {
      'use strict';

      $scope.tab = [false, false];
      switch( $state.current.name ) {
        case 'conversations.public':
          $scope.private = false;
          $scope.tab[1] = true;
          break;
        case 'conversations.private':
          $scope.private = true;
          $scope.tab[2] = true;
          break;
        default:
          $scope.private = true;
          $scope.type = 'all';
          $scope.tab[0] = true;
      }

      $scope.composeConversation = function(){
        $('#modalComposeConversation').modal().toggle();
      };
    }]);