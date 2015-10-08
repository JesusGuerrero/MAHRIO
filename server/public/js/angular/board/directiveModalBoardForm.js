angular.module('baseApp.directives')
  .directive('modalBoardForm', [ 'FormHelper', '$state', 'Board', function(FormHelper, $state, Board){
    'use strict';

    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/assets/html/board/form',
      link: function(scope){
        var formSetup = function(){
          FormHelper.setupFormHelper(scope, 'board', Board );
          scope.addColumn = function(name){
            if( name ) {
              scope.board.columns.push( {name: name});
            }
          };
          scope.removeColumn = function( i ) {
            scope.board.columns.splice( i, 1);
          };
        };
        scope.board = {
          members: {},
          columns: []
        };
        scope.save = function(){
          Board.add( scope.board )
            .then( function(){
              $state.reload();
            });
        };
        formSetup();
      }
    };
  }]);