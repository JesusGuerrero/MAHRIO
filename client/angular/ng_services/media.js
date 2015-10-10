angular.module('baseApp.services').factory('MediaResource', [ '$resource', function($resource) {
  'use strict';
  return $resource('/api/media/:id',
    { id: '@id' },
    {
      create: { method: 'POST' },
      read:   {
        method: 'GET',
        headers : {
          'x-amz-acl': 'public-read'
        }
      },
      remove: { method: 'DELETE' }
    });
}]);
angular.module('baseApp.services').factory('Media', [ 'MediaResource', function( MediaResource ) {
  'use strict';
  return {
    add: function( media ) { return MediaResource.create( {media: media} ).$promise; },
    get: function( id ) { return MediaResource.read( id ? {id: id} : {} ).$promise; },
    getKey: function( media ) {
      media.id = 'key';
      return MediaResource.read( media ).$promise;
    },
    remove: function(id){ return MediaResource.remove( {id: id} ).$promise; }
  };
}]);