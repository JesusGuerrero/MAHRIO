angular.module('baseApp.directives')
  .directive('footer', ['$rootScope',
    function( $rootScope ){
      'use strict';
      return {
        restrict: 'A',
        replace: true,
        templateUrl: function() {
          if( $rootScope.user === 'anyUser') {
            return 'assets/html/layout/footer/index';
          } else {
            return '/assets/html/layout/footer/user';
          }
        }
      };
    }
  ]);