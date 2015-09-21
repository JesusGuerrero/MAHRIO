angular.module('baseApp.directives')
  .directive('footer', ['$rootScope','_',
    function( $rootScope, _ ){
      'use strict';
      return {
        restrict: 'A',
        replace: true,
        templateUrl: function() {
          if( !_.contains( $rootScope.access, 'any' ) ) {
            return 'assets/html/layout/footer/index';
          } else {
            return '/assets/html/layout/footer/user';
          }
        }
      };
    }
  ]);