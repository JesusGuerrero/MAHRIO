angular.module('baseApp.directives')
  .directive( 'tasksCurrent', [ 'Task','SubHeader', function( Task, SubHeader ) {
    'use strict';
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/assets/html/task/directiveTasksCurrent',
      scope: {
        active: '='
      },
      link: function( scope ) {
        scope.initDraggable = function(){
          $('.current-tasks div.current-task').each( function(){
            $(this).draggable({
              zIndex: 1070,
              revert: true, // will cause the event to go back to its
              revertDuration: 0  //  original position after the drag
            });
          });
        };

        $('.drop-test').each( function(){
          $( this ).droppable({
            accept: '.current-task',
            hoverClass: 'droppable-hover',
            drop: function(event, ui) {
              var dropped = ui.draggable;
              var droppedOn = $(this);
              var task = {};
              var newParent = $(this).attr('id'), oldParent = dropped.parent().parent().attr('id');
              if( newParent ) {
                task[ newParent ] = true;
              }
              task[ oldParent ] = false;
              if( newParent === oldParent ) {
                return;
              }
              Task.update( dropped.attr('id'), task )
                .then( function(){
                  $(dropped).detach().css({top: 0,left: 0}).appendTo(droppedOn);
                });
            }
          });
        });
        $('.box-title').matchHeight();
        if( scope.active ) {
          Task.getAll()
            .then( function(response){
              scope.tasks = response.tasks;
            });
          SubHeader.setHeader( 'Tasks' );
          SubHeader.set.subTitle = 'Viewing Current';
        }
      }
    };
  }])
  .directive('tasksBacklog', ['Task','SubHeader', function(Task, SubHeader) {
    'use strict';
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/assets/html/task/directiveTasksBacklog',
      scope: {
        active: '='
      },
      link: function( scope ) {
        if( scope.active ) {
          SubHeader.setHeader( 'Tasks' );
          SubHeader.set.subTitle = 'Viewing All Backlog';
          Task.getAll()
            .then( function(response){
              scope.tasks = response.tasks;
              if( scope.tasks.length ) {
                scope.current = scope.tasks[0];
              }
            });
        }
        scope.loadTask = function(id){
          scope.current = scope.tasks[id];
        };
        scope.assignToMe = function(id){
          Task.assignToMe(id)
            .then( function(){
              window.alert('assigned');
            });
        };
      }
    };
  }])
  .directive('tasksNew', ['Task','SubHeader','$state',function( Task, SubHeader, $state ){
    'use strict';
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/assets/html/task/directiveTasksNew',
      scope: {
        active: '=',
        id: '=edit'
      },
      link: function(scope){
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


        scope.task = {};
        if( scope.id ) {
          Task.getOne( scope.id )
            .then( function(response){
              scope.task = response.task;
              $('.color-chooser-btn')
                .css({'background-color': scope.task.color, 'border-color': scope.task.color})
                .html('Color:  <span class="caret"></span>');
              console.log( scope.task );
              //$('#wysihtml5-content').val( scope.task.description );
            });
          if( scope.active ) {
            SubHeader.setHeader( 'Tasks' );
            SubHeader.set.subTitle = 'Edit Task';
          }
        } else {
          if( scope.active ) {
            SubHeader.setHeader( 'Tasks' );
            SubHeader.set.subTitle = 'New Task';
          }
          scope.task = {
            color: currColor
          };
        }
        scope.save = function(){
          scope.task.description = $('#wysihtml5-content').val();
          Task.save( scope.task )
            .then( function(){
              $state.go('tasks',{}, { reload: true });
            });

        };
      }
    };
  }])
  .directive('tasksView', ['Task','SubHeader',function(Task, SubHeader){
    'use strict';
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/assets/html/task/directive/TasksView',
      scope: {
        id: '=',
        active: '='
      },
      link: function(scope){
        Task.getOne( scope.id )
          .then( function(response){
            scope.task = response.task;
          });
        if( scope.active ) {
          SubHeader.setHeader( 'Tasks' );
          SubHeader.set.subTitle = 'Viewing Task';
        }
      }
    };
  }]);