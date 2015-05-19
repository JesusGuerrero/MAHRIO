angular.module('baseApp.directives')
  .directive('rootPageView', ['$rootScope',
    function($rootScope){
      'use strict';
      return {
        restrict: 'A',
        templateUrl: function() {
          switch ($rootScope.role) {
            case 'any':
              return '/assets/html/views/home';
            case 'authorizedUser':
              return '';
            case 'admin':
              return '/assets/html/views/dashboard';
          }
        }
      };
    }
  ]);