angular.module('baseApp.directives')
  .directive('headerNavigationTop', ['$rootScope','currentUser',
    function( $rootScope, currentUser ){
      'use strict';
      return {
        restrict: 'A',
        replace: true,
        scope: {
          role: '='
        },
        link: function(scope) {
          scope.logout = $rootScope.logout;
          scope.current = currentUser.get();
          scope.$watch( currentUser.get, function(newUser){
            if( typeof newUser === 'undefined' ) {
              newUser = {role: 'any'};
            }
            switch( newUser.role ){
              case 'any':
                scope.dynamicTemplateUrl = '/assets/html/layout/header/any';
                break;
              case 'admin':
                scope.dynamicTemplateUrl = '/assets/html/layout/header/admin';
                scope.user = newUser;
                break;
              case 'authorized':
                scope.dynamicTemplateUrl = '/assets/html/layout/header/authorized';
                scope.user = newUser;
                break;
              default:
            }
            scope.toggleSidebar = function(){
              $rootScope.toggleSidebarCollapsed();
            };
          });
        },
        template: '<ng-include src="dynamicTemplateUrl" render-app-gestures></ng-include>'
      };
    }
  ]);