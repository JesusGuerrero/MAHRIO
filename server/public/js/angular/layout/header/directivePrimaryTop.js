angular.module('baseApp.directives')
  .directive('headerNavigationTop', ['$rootScope','currentUser','Socket','Notification','_','Chat','$state','$timeout',
    function( $rootScope, currentUser, Socket, Notification, _, Chat, $state, $timeout ){
      'use strict';
      return {
        restrict: 'A',
        replace: true,
        scope: {
          access: '='
        },
        link: function(scope) {
          scope.logout = $rootScope.logout;
          scope.current = currentUser.get();

          scope.$watch( currentUser.get, function(newUser){
            if( typeof newUser === 'undefined' ) {
              newUser = {access: ['any']};
            }

            if( _.contains( newUser.access, 'any' ) ) {
              scope.dynamicTemplateUrl = '/assets/html/layout/header/any';
            } else {
              scope.dynamicTemplateUrl = '/assets/html/layout/header/authorized';
              scope.user = newUser;
            }
            scope.toggleSidebar = function(){
              $rootScope.toggleSidebarCollapsed();
              if( !_.contains(newUser.access, 'any') && $state.current.url === '/') {
                $timeout( function(){
                  $state.reload();
                }, 400);
              }
            };
          });

        },
        template: '<ng-include src="dynamicTemplateUrl" render-app-gestures></ng-include>'
      };
    }
  ]);