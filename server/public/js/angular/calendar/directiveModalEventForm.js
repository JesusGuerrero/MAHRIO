angular.module('baseApp.directives')
  .directive('modalEventForm', [ 'Calendar', 'FormHelper', '$state', function(Calendar, FormHelper, $state) {
    'use strict';

    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/assets/html/calendar/form',
      link: function(scope){
        scope.has = {invited: false};
        FormHelper.setupFormHelper(scope, 'event', Calendar );
        scope.event = {
          invited: {}
        };
        scope.save = function(){
          var event = _.extend( {}, scope.event );
          if( $('#eventStart').val() ) {
            event.start = new Date( $('#eventStart').val() + ' UTC').toISOString();
          }
          if( $('#eventEnd').val() ) {
            event.end = new Date( $('#eventEnd').val() + ' UTC').toISOString();
          }
          event.invited = Object.keys(event.invited);

          //if( scope.event._id ) {
          //  Calendar.update( event )
          //    .then( function(){
          //      $state.reload();
          //    });
          //} else {
            Calendar.add( event )
              .then( function(){
                $state.reload();
              });
          //}
        };
      }
    };
  }]);