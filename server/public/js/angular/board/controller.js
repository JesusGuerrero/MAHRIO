angular.module('baseApp.controllers')
  .controller('BoardController', ['$scope', '$state', '$http', 'currentUser', 'Board', '_','Notification','FormHelper',
    function($scope, $state, $http, currentUser, Board, _, Notification, FormHelper ){
      'use strict';

      $scope.boards = [];
      $scope.has = {members: false, admins: false, owner: false};
      var formSetup = function(){
        FormHelper.setupFormHelper($scope, 'board', Board );
        $scope.addColumn = function(name){
          if( name ) {
            $scope.board.columns.push( {name: name});
          }
        };
        $scope.removeColumn = function( i ) {
          $scope.board.columns.splice( i, 1);
        };
      };
      $scope.currentUser = currentUser.get();
      switch( $state.current.name ) {
        case 'boards.new':
          $scope.board = {
            members: {},
            columns: []
          };
          $scope.add = function(){
            Board.add( $scope.board )
              .then( function(){
                $state.go('boards.list',{}, { reload: true });
              });
          };
          formSetup();
          break;
        case 'boards.detail':
          $scope.board = Board.get( $state.params.id );
          break;
        case 'boards.list':
          Board.get()
            .then( function( res ) {
              $scope.boards = res.boards;
            });
          break;
        case 'boards.edit':
          Board.get( $state.params.board )
            .then( function( res ) {
              $scope.board = res.board;
              $scope.hasMembers = $scope.board.members ? Object.keys($scope.board.members).length : 0;
            });
          formSetup();
          $scope.update = function( ) {
            Board.update( $scope.board )
              .then( function(){
                $state.go('boards.list');
              });
          };
          break;
        default:
          break;
      }

      $scope.remove = function( id ){
        Notification.id = id;
        Notification.confirm = 'Are you sure you want to delete?';
        Notification.confirmed = false;
      };
      $scope.$watch( function(){ return Notification.confirmed; }, function(newVal) {
        if (newVal) {
          Notification.confirmed = null;
          Board.remove( Notification.id )
            .then( function(){
              $state.go('boards.list', {}, {reload: true});
            });
        }
      });
    }]);