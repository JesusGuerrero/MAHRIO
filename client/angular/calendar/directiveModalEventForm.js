angular.module('baseApp.directives')
  .directive('modalEventForm', [ 'Calendar', 'FormHelper', '$state', '_', function(Calendar, FormHelper, $state, _) {
    'use strict';

    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/assets/html/calendar/form',
      scope: {
        networkId: '=',
        edit: '='
      },
      link: function(scope){
        scope.has = {invited: false};
        FormHelper.setupFormHelper(scope, 'event', Calendar );

        scope.$watch( function(){ return scope.edit; }, function(newVal){
          if( newVal ) {
            scope.event = newVal;
          } else {
            scope.event = {
              invited: {},
              network: scope.networkId
            };
          }
        });

        scope.save = function(){
          var event = _.extend( {}, scope.event );
          if( $('#eventStart').val() ) {
            event.start = new Date( $('#eventStart').val() + ' UTC').toISOString();
          }
          if( $('#eventEnd').val() ) {
            event.end = new Date( $('#eventEnd').val() + ' UTC').toISOString();
          }
          event.invited = event.invited ? Object.keys(event.invited) : [];
          if( event._id ) {
            Calendar.update( event )
              .then( function(){
                scope.$emit('closeModal');
              });
          } else {
            Calendar.add( event )
              .then( function(){
                scope.$emit('closeModal');
              });
          }
        };
      }
    };
  }]);