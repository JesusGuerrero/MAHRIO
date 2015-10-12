angular.module('baseApp.directives')
  .directive( 'tasksCurrent', [ 'Task', function( Task ) {
    'use strict';
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/assets/html/task/directiveTasksCurrent',
      scope: {
        active: '=',
        board: '='
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
        scope.initDroppable = function(){
          $('.drop-test').each( function(){
            $( this ).droppable({
              accept: '.current-task',
              hoverClass: 'droppable-hover',
              drop: function(event, ui) {
                var dropped = ui.draggable;
                var droppedOn = $(this);
                if( dropped.parent().attr('id') === droppedOn.attr('id') ) {
                  return;
                }
                Task.update( dropped.attr('id'), { _column: droppedOn.attr('id') || null } )
                  .then( function(){

                  });
                $(dropped).detach().css({top: 0,left: 0}).appendTo(droppedOn);
              }
            });
          });
        };

        $('.box-title').matchHeight();
        if( scope.active ) {

        }
      }
    };
  }])
  .directive('tasksBacklog', ['Task','$stateParams', '_',  function(Task, $stateParams, _) {
    'use strict';
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/assets/html/task/directiveTasksBacklog',
      scope: {
        active: '=',
        tasks: '='
      },
      link: function( scope ) {
        //if( scope.active ) {
        //  Task.getAll( $stateParams.boardId )
        //    .then( function(response){
        //      scope.tasks = response.tasks ;//_.filter( response.tasks, function(task) { return !task.start; });
        //      if( scope.tasks.length ) {
        //        scope.current = scope.tasks[0];
        //      }
        //    });
        //}
        scope.loadTask = function(id){
          scope.current = scope.tasks[id];
        };
        scope.assignToMe = function(id){
          Task.assignToMe(id)
            .then( function(){
              window.alert('assigned');
            });
        };
        scope.startTask = function( id ) {
          Task.start( id )
            .then( function() {
              scope.tasks = _.filter( scope.tasks, function(task){ return task._id !== id; });
              if( scope.tasks.length ) { scope.current = scope.tasks[id]; }
            });
        };
        scope.editTask = function( task ){
          scope.$emit('task:edit', task );
        };
      }
    };
  }])
  .directive('tasksNew', ['Task','$state','$stateParams', function( Task, $state, $stateParams ){
    'use strict';
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/assets/html/task/directiveTasksNew',
      scope: {
        active: '=',
        id: '=',
        taskId: '='
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

        console.log( scope.id );
        scope.task = {};
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
            scope.task._board = $stateParams.boardId;
          }
          Task.save( scope.task )
            .then( function(){
              /* global alert */
              alert('saved');
              //ui-sref="networks.board({tab: 'backlog'})"
              $state.go('networks.board',{tab: 'backlog'}, { reload: true });
            });

        };
      }
    };
  }])
  .directive('tasksView', ['Task',function(Task){
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

        }
      }
    };
  }]);