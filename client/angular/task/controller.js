// jshint maxstatements:60
angular.module('baseApp.controllers')
  .controller('TaskController', ['$scope','$state', 'Task',
    function($scope, $state, Task){
      'use strict';
      /*jshint maxcomplexity:10 */

      $scope.tab = [false, false, false, false];
      switch( $state.current.name ) {
        case 'tasks.current':
          $scope.tab[0] = true;
          break;
        case 'tasks':
          $scope.tab[1] = true;
          break;
        case 'tasks.new':
          $scope.tab[2] = true;
          break;
        case 'tasks.edit':
          $scope.tab[3] = true;
          $scope.id = $state.params.id;
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