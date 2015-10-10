angular.module('baseApp.directives')
  .directive('headerNavigationTop', ['$rootScope','currentUser','Socket','Notification','_','Chat','$state','$timeout','$http',
    function( $rootScope, currentUser, Socket, Notification, _, Chat, $state, $timeout, $http ){
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

          var usersCache = [];
          scope.selected = function($item) {
            var extracted = $item.match(/(.*?)&lt;(.*?)&gt;/),
              selection = _.find(usersCache, function (user) {
                return user.email === extracted[2];
              });

              $state.go( 'users.detail', {id: selection._id}, {reload: true});
              scope.$broadcast('clearInput');
          };
          scope.getUsers = function(val) {
            return $http.get('/api/autocomplete/users', {
              params: {
                q: val
              }
            }).then(function(response){
              usersCache = response.data.users;
              var current = currentUser.get(),
                filteredUserList =  _
                  .filter( response.data.users, function(user){
                    return user.email !== current.email;
                  });
              return filteredUserList.map(function(user){
                return (user.profile.firstName ? user.profile.firstName : '') + ' ' + (user.profile.lastName ?user.profile.lastName:'') + ' &lt;'+user.email+'&gt;';
              });
            });
          };

        },
        template: '<ng-include src="dynamicTemplateUrl" render-app-gestures></ng-include>'
      };
    }
  ]);