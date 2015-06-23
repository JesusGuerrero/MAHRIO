angular.module('baseApp.services')
  .factory('currentUser', ['$state', '$location', '$rootScope', 'User',
    function ($state, $location, $rootScope, User) {
    'use strict';

    var currentUser;

    function login (user, route) {
      currentUser = user;
      $rootScope.setRole( user.role || 'any' );
      $rootScope.$emit('userLoggedIn');
      if( route ){
        $state.transitionTo( 'root', {}, { reload: true});
      }
    }

    function isLoggedIn(){
      return User.profile();
    }

    function logout(){
      return User.logout();
    }

    function update( user ) {
      return User.update( user );
    }

    return {
      get: function () {
        return currentUser;
      },
      login: login,
      isLoggedIn: isLoggedIn,
      logout: logout,
      update: update
    };
  }]);
