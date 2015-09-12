angular.module('baseApp.directives')
  .directive('headerNavigationTop', ['$rootScope','currentUser','Socket','Notification','_',
    function( $rootScope, currentUser, Socket, Notification, _ ){
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
              newUser = {access: 'any'};
            } else {

              Socket.get.on('event:notification:'+newUser._id, function(){

                Notification.get()
                  .then( function(res){
                    scope.notifications = _.groupBy( res.notifications, function(item){ return item.resource; });
                  });
              });
            }
            switch( newUser.access ){
              case 'any':
                scope.dynamicTemplateUrl = '/assets/html/layout/header/any';
                break;
              case 'admin':
                scope.dynamicTemplateUrl = '/assets/html/layout/header/authorized';
                scope.user = newUser;
                break;
              case 'authorized':
                scope.dynamicTemplateUrl = '/assets/html/layout/header/authorized';
                scope.user = newUser;
                scope.notifications = {};
                Notification.get()
                  .then( function(res){
                    scope.notifications = _.groupBy( res.notifications, function(item){ return item.resource; });
                  });
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