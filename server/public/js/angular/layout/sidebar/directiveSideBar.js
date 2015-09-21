angular.module('baseApp.directives')
  .directive('sideBar', ['$rootScope','$state','_',
    function($rootScope, $state, _ ){
      'use strict';
      return {
        restrict: 'A',
        scope: {
          access: '='
        },
        link: function(scope, elem, attrs) {
          scope.logout = $rootScope.logout;
          scope.$watch( 'access', function(access){
            if( _.contains( access, 'sudo' ) || _.contains( access, 'admin' ) || _.contains( access, 'authorized' ) ) {
              if( attrs.type === 'navigation' ){
                scope.dynamicTemplateUrl = '/assets/html/layout/sidebar/leftMainNavigation';
              } else {
                scope.dynamicTemplateUrl = '/assets/html/layout/sidebar/rightMainSettings';
              }
            } else {
              scope.dynamicTemplateUrl = '';
            }
          });
          scope.goTo = function( state, id ) {
            if( $('#'+id).next().height() < 10 ) {
              $state.go( state );
            }
          };
        },
        template: '<ng-include src="dynamicTemplateUrl" render-app-gestures></ng-include>'
      };
    }
  ]);