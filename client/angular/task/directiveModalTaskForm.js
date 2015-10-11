angular.module('baseApp.directives')
  .directive( 'modalTaskForm', ['Task', '$state', function(Task, $state){
    'use strict';

    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/assets/html/task/form',
      scope: {
        boardId: '=',
        edit: '='
      },
      link: function( scope ){
        var currColor = '#f56954';
        var colorChooser = $('.color-chooser-btn');
        $('#color-chooser > li > a').click(function(e) {
          e.preventDefault();
          currColor = $(this).css('color');
          colorChooser
            .css({'background-color': currColor, 'border-color': currColor})
            .html('Color: <span class="caret"></span>');
          scope.task.color = currColor;
        });

        scope.$watch( function(){ return scope.edit; }, function( newVal ) {
          if( newVal ) {
            scope.task = newVal.targetScope.current;
            console.log( scope.task );
          } else {
            scope.task = {};
          }
        });
        if( scope.taskId ) {
          Task.getOne( scope.id )
            .then( function(response){
              scope.task = response.task;
              $('.color-chooser-btn')
                .css({'background-color': scope.task.color, 'border-color': scope.task.color})
                .html('Color:  <span class="caret"></span>');
              console.log( scope.task );
            });
        } else {
          scope.task = {
            color: currColor
          };
        }
        scope.save = function(){
          scope.task.description = $('#wysihtml5-content').val();
          if( !scope.task._board ) {
            scope.task._board = scope.boardId;
          }
          Task.save( scope.task )
            .then( function(){
              //alert('saved');
              $state.go('networks.board',{tab: 'backlog'}, { reload: true });
              //$state.go('boards.detail.backlog',{}, { reload: true });
            });

        };
      }
    };
  }]);