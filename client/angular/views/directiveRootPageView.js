angular.module('baseApp.directives')
  .directive('rootPageView', ['$rootScope',
    function($rootScope){
      'use strict';
      return {
        restrict: 'A',
        templateUrl: function() {
          switch ($rootScope.access) {
            case 'any':
              return '/assets/html/views/home';
            case 'authorized':
              return '/assets/html/views/dashboard';
            case 'admin':
              return '/assets/html/views/dashboard';
          }
        }
      };
    }
  ]);