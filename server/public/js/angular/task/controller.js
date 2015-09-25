// jshint maxstatements:60
angular.module('baseApp.controllers')
  .controller('TaskController', ['$scope','$state', 'Task',
    function($scope, $state, Task){
      'use strict';
      /*jshint maxcomplexity:10 */

      $scope.tab = [false, false, false, false];
      switch( $state.current.name ) {
        case 'boards.detail':
          $scope.$parent.board.then( function( res ) {
            $scope.board = res.board;
          });
          $scope.tab[0] = true;
          break;
        case 'boards.detail.backlog':
          $scope.tab[1] = true;
          break;
        case 'boards.detail.backlog.new':
          $scope.tab[2] = true;
          break;
        case 'boards.detail.backlog.edit':
          $scope.tab[3] = true;
          $scope.id = $state.params.task;
          break;
        default:
          $scope.tab[0] = true;
          break;
      }

      $scope.actions = {
        save: function( task ){
          task.description = $('#wysihtml5-content').val();
          return Task.save( task );
        },
        send: function( task ){
          task.description = $('#wysihtml5-content').val();
          return Task.create( task );
        }
      };
    }
  ]
);