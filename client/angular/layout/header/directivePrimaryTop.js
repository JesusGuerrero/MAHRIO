angular.module('baseApp.directives')
  .directive('headerNavigationTop', ['$rootScope','currentUser','Socket',
    function( $rootScope, currentUser, Socket ){
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

              Socket.get.on('event:private:'+newUser._id, function(socket){
                console.log( socket );
                alert('got socket message');
                //  //if( conversations[ socket._conversation.id] ){
                //  //  conversations[ socket._conversation.id ][0].messages.unshift( socket );
                //  //}
                //  //if( socket._conversation.id === $scope.currentConversation.id ){
                //  //  $scope.currentConversation.messages.unshift(socket);
                //  //}
                //  //console.log('message: ' + socket.content);
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