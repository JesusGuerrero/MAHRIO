angular.module('baseApp.controllers')
  .controller('NetworkBoardsCtrl', ['$scope', 'Board', function( $scope, Board ) {
    'use strict';
    console.log('in NetworkBoard');
    $scope.boards = []; // parent.networks.boards;

    $scope.networkId = 0; // parent.currentNetworkId

    $scope.createNetworkBoard = function(){
      Board.add( $scope.network )
        .then( function() {

        });
    };
  }]);