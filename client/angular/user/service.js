angular.module('baseApp.services').factory('UserResource', [ '$resource', function($resource) {
  'use strict';
  return $resource('/api/users/:action',
    { action: '@action' },
    {
      create: {
        method: 'POST'
      },
      register: {
        method: 'POST'
      },
      login: {
        method: 'POST'
      },
      profile: {
        method: 'GET'
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
    addAvatar: function( media ) {
      return UserResource.create( {action: 'avatar'}, {media: media}).$promise;
    },
    confirmAccount: function(obj){
      return UserResource.confirmAccount( {action: 'activate'}, obj).$promise;
    },
    profile: function(){
      return UserResource.profile( {action: 'me'}).$promise;
    },
    getUsersList: function(){
      return UserResource.get( {action: 'all'}).$promise;
    },
    get: function( id ){
      return UserResource.get( {action: id}).$promise;
    },
    makeAdmin: function(email){
      return UserResource.put( {action: 'other'}, {email: email, access: 'admin'}).$promise;
    },
    update: function( user ) {
      return UserResource.put( {action: 'me'}, user).$promise;
    }
  };
}]);
