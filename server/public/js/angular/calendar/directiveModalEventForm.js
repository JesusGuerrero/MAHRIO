angular.module('baseApp.directives')
  .directive('modalEventForm', [ function() {
    'use strict';

    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/assets/html/calendar/form',
      link: function(){

      }
    };
  }]);