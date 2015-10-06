angular.module('baseApp.services').factory('NetworkResource', [ '$resource', function($resource) {
  'use strict';
  return $resource('/api/networks/:id/:action',
    { id: '@id', action: '@action' },
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
    addCoverImage: function( network, media ){
      return NetworkResource.update(
        {
          id: network._id
        },{
          network: {
            mediaInsert: media
          }
        }).$promise;
    },
    get: function( id ) {
      return NetworkResource.read( id ? {id: id} : {} ).$promise;
    },
    requestAdmin: function( obj ){
      return NetworkResource.update( {id: obj._id, action: 'admin'} ) .$promise;
    },
    join: function( obj ){
      return NetworkResource.update( {id: obj._id, action: 'join'} ) .$promise;
    },
    leave: function( obj ) {
      return NetworkResource.update( {id: obj._id, action: 'leave'} ) .$promise;
    },
    update: function( obj ) {
      return NetworkResource.update( {id: obj._id}, {network: obj} ) .$promise;
    },
    remove: function(id){
      return NetworkResource.remove( {id: id} ).$promise;
    }
  };
}]);
