angular.module('baseApp.directives')
  .directive('pageLayout', ['$rootScope',
    function( $rootScope ){
      'use strict';
      return {
        restrict: 'A',
        replace: true,
        transclude: true,
        templateUrl: '/assets/html/layout/page/index'
      };
    }
  ]);