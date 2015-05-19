angular.module('baseApp.services').factory('UserResource', [ '$resource', function($resource) {
  'use strict';
  return $resource('/api/users/:action',
    { action: '@action' },
    {
      register: {
        method: 'POST'
      },
      login: {
        method: 'POST'
      },
      profile: {
        method: 'GET'
      },
      logout: {
        method: 'POST'
      },
      recoverPassword: {
        method: 'POST'
      },
      isValidToken: {
        method: 'POST'
      },
      passwordReset: {
        method: 'POST'
      },
      confirmAccount: {
        method: 'POST'
      },
      getBelongTo: {
        method: 'GET'
      },
      get: {
        method: 'GET'
      },
      post: {
        method: 'POST'
      },
      put: {
        method: 'PUT'
      }
    }
  );
}]);
angular.module('baseApp.services').factory('User', [ 'UserResource', '$q', function( UserResource, $q) {
  'use strict';
  return {
    register: function(obj){
      var defer = $q.defer();
      UserResource.register({action:'register'}, obj, function(user,headers){
        defer.resolve({user: user, headers: headers});
      }, function(err){
        defer.reject(err);
      });

      return defer.promise;
    },
    login: function(obj){
      var defer = $q.defer();
      UserResource.login( {action: 'login'}, obj, function(user, headers){
        defer.resolve( { user: user, headers: headers } );
      }, function(err){
        defer.reject(err);
      });

      return defer.promise;
    },
    recoverPassword: function(obj){
      return UserResource.recoverPassword( {action: 'recoverPassword'}, obj).$promise;
    },
    hasValidToken: function(obj){
      return UserResource.isValidToken( {action: 'isValidToken'}, obj).$promise;
    },
    passwordReset: function(obj){
      var defer = $q.defer();
      UserResource.passwordReset( {action: 'passwordReset'}, obj, function(user, headers){
        defer.resolve( { user: user, headers: headers } );
      }, function(err){
        defer.reject(err);
      });

      return defer.promise;
    },
    confirmAccount: function(obj){
      return UserResource.confirmAccount( {action: 'activate'}, obj).$promise;
    },
    profile: function(){
      return UserResource.profile( {action: 'me'}).$promise;
    },
    logout: function(){
      return UserResource.logout( {action: 'logout'}).$promise;
    },
    getUsersList: function(){
      return UserResource.get( {action: 'all'}).$promise;
    },
    makeAdmin: function(email){
      return UserResource.put( {action: 'other'}, {email: email, role: 'admin'}).$promise;
    }
  };
}]);
