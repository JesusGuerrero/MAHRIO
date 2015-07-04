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
                scope.dynamicTemplateUrl = '/assets/html/layout/header/primaryTop2';
                break;
              case 'admin':
                scope.dynamicTemplateUrl = '/assets/html/layout/header/primaryTop';
                scope.user = newUser;
                console.log( newUser );
                break;
              default:
            }
          });
        },
        template: '<ng-include src="dynamicTemplateUrl" render-app-gestures></ng-include>'
      };
    }
  ]);