angular.module('baseApp.directives')
  .directive('rootPageView', ['$rootScope','Newsletter','_',
    function($rootScope, Newsletter, _){
      'use strict';
      return {
        restrict: 'A',
        templateUrl: function() {
          if( _.contains( $rootScope.access, 'sudo' ) ) {
            return '/assets/html/sudo_dashboard/sudo_view';
          } else if ( _.contains( $rootScope.access, 'admin' ) ) {
            return '/assets/html/admin_dashboard/admin_view';
          } else if ( _.contains( $rootScope.access, 'authorized' ) ) {
            return '/assets/html/dashboard/authorized_view';
          } else {
            return '/assets/html/pages/home';
          }
        }
      };
    }
  ]);