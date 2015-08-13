angular.module('baseApp.services')
  .factory('currentUser', ['$state', '$location', '$rootScope', '$q', 'User','Profile','Session',
    function ($state, $location, $rootScope, $q, User, Profile, Session) {
    'use strict';

    var currentUser;

    function login (user, route) {
      currentUser = user;
      console.log( user );
      $rootScope.setAccess( user.access || 'any' );
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
      Session.logout()
        .then( function(){
          currentUser = {access: 'any'};
          $rootScope.setAccess( 'any' );
          $state.transitionTo('root');
          defer.resolve();
        });
      return defer.promise;
    }

    function update( user ) {
      return Profile.update( user );
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
