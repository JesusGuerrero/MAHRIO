angular.module('baseApp.directives')
  .directive('sideBar', ['$rootScope',
    function($rootScope){
      'use strict';
      return {
        restrict: 'A',
        scope: {
          role: '='
        },
        link: function(scope, elem, attrs) {
          scope.logout = $rootScope.logout;
          scope.$watch( 'role', function(newRole){
            switch( newRole ){
              case 'any':
                scope.dynamicTemplateUrl = '';
                break;
              case 'admin':
                if( attrs.type === 'navigation' ){
                  scope.dynamicTemplateUrl = '/assets/html/layout/sidebar/leftMainNavigation';
                } else {
                  scope.dynamicTemplateUrl = '/assets/html/layout/sidebar/rightMainSettings';
                }
                break;
              default:
            }
          })
        },
        template: '<ng-include src="dynamicTemplateUrl" render-app-gestures></ng-include>'
      };
    }
  ]);