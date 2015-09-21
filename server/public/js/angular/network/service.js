angular.module('baseApp.services').factory('NetworkResource', [ '$resource', function($resource) {
  'use strict';
  return $resource('/api/networks/:id',
    { id: '@id' },
    {
      create: {
        method: 'POST'
      },
      read: {
        method: 'GET'
      },
      update: {
        method: 'PUT'
      },
      remove: {
        method: 'DELETE'
      }
    }
  );
}]);
angular.module('baseApp.services').factory('Network', [ 'NetworkResource', function( NetworkResource) {
  'use strict';
  // Caching Option here...
  return {
    add: function( obj ) {
      return NetworkResource.create( {network: obj} ).$promise;
    },
    get: function( id ) {
      return NetworkResource.read( id ? {id: id} : {} ).$promise;
    },
    update: function( obj ) {
      return NetworkResource.update( {id: obj._id}, {network: obj} ) .$promise;
    },
    remove: function(id){
      return NetworkResource.remove( {id: id} ).$promise;
    }
  };
}]);
