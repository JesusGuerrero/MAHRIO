var p ={};
angular.module('baseApp.directives')
  .directive('modalEditEvent', ['Calendar',
    function( Calendar ){
      'use strict';
      return {
        restrict: 'E',
        templateUrl: '/assets/html/calendar/modalEditEvent',
        replace: true,
        link: function(scope) {
          scope.$watch( function() { return Calendar.currentEvent; }, function(newData){
            if( newData ) {
              scope.event = newData;
              scope.$parent.dataObject = scope.event;
            }
          });
        }
      };
    }
  ]);