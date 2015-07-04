angular.module('baseApp.services')
  .factory('currentUser', ['$state', '$location', '$rootScope', '$q', 'User',
    function ($state, $location, $rootScope, $q, User) {
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
      var defer = $q.defer();
      User.logout()
        .then( function(){
          currentUser = {role: 'any'};
          $rootScope.setRole( 'any' );
          $state.transitionTo('root');
          defer.resolve();
        });
      return defer.promise;
    }

    function update( user ) {
      return User.update( user );
    }

    return {
      get: function () {
        return currentUser;
      },
      set: function( currUser ) {
        currentUser = currUser;
      },
      login: login,
      isLoggedIn: isLoggedIn,
      logout: logout,
      update: update
    };
  }]);
