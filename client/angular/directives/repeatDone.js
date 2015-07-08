angular.module('baseApp.directives')
  .directive('repeatEnd', function(){
    'use strict';
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        if (scope.$last) {
          scope.$eval(attrs.repeatEnd);
        }
      }
    };
  });