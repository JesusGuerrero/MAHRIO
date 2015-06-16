angular.module('baseApp.directives')
  .directive('pageLayout', [
    function(){
      'use strict';
      return {
        restrict: 'A',
        replace: true,
        transclude: true,
        templateUrl: '/assets/html/layout/page/index'
      };
    }
  ]);