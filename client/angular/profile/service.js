angular.module('baseApp.services').factory('ProfileResource', [ '$resource', function($resource) {
  'use strict';
  return $resource('/api/profile',
    {},
    {
      get: {
        method: 'GET'
      },
      update: {
        method: 'PUT'
      }
    }
  );
}]);
angular.module('baseApp.services').factory('Profile', [ 'ProfileResource', function( ProfileResource) {
  'use strict';
  return {
    get: function(){
      ProfileResource.get().$promise;
    },
    update: function( profile ) {
      return ProfileResource.update( {}, {profile: profile}).$promise;
    }
  };
}]);
