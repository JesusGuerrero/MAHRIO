angular.module('baseApp.services').factory('BoardResource', [ '$resource', function($resource) {
  'use strict';
  return $resource('/api/boards/:id',
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
angular.module('baseApp.services').factory('Board', [ 'BoardResource', function( BoardResource) {
  'use strict';
  // Caching Option here...
  return {
    add: function( networkId, obj ) {
      return BoardResource.create( {id: networkId}, {board: obj} ).$promise;
    },
    get: function( id, networkId ) {
      var options = id ? {id: id} : {};
      if( networkId ) {
        options.networkId = networkId;
      }
      return BoardResource.read( options ).$promise;
    },
    update: function( obj ) {
      return BoardResource.update( {id: obj._id}, {board: obj} ) .$promise;
    },
    remove: function(id){
      return BoardResource.remove( {id: id} ).$promise;
    }
  };
}]);
