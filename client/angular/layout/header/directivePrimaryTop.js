angular.module('baseApp.directives')
  .directive('headerNavigationTop', ['$rootScope',
    function( $rootScope ){
      'use strict';
      return {
        restrict: 'A',
        replace: true,
        scope: {
          role: '='
        },
        link: function(scope) {
          scope.logout = $rootScope.logout;
          scope.$watch( 'role', function(newRole){
            switch( newRole ){
              case 'any':
                scope.dynamicTemplateUrl = '/assets/html/layout/header/primaryTop2';
                break;
              case 'admin':
                scope.dynamicTemplateUrl = '/assets/html/layout/header/primaryTop';
                break;
              default:
            }
          });
        },
        template: '<ng-include src="dynamicTemplateUrl" render-app-gestures></ng-include>'
      };
    }
  ]);