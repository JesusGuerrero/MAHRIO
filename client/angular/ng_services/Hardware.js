angular.module('baseApp.services').factory('HardwareResource', [ '$resource', function($resource) {
  'use strict';
  return $resource('/api/hardware/:id',
    { id: '@id' },
    {
      create: { method: 'POST' },
      read:   { method: 'GET' },
      update: { method: 'PUT' },
      remove: { method: 'DELETE' }
    });
}]);
angular.module('baseApp.services').factory('Hardware', [ 'HardwareResource', function( HardwareResource ) {
  'use strict';
  return {
    add: function( hardware ) {
      return HardwareResource.create( {hardware: hardware} ).$promise; },
    addCoverImage: function( hardware, media ){
      return HardwareResource.update(
        {
          id: hardware._id
        },{
          hardware: {
            mediaInsert: media
          }
        }).$promise;
    },
    update: function( hardware ) { return HardwareResource.update( {id: hardware._id}, {hardware: hardware} ) .$promise; },
    remove: function( id ){ return HardwareResource.remove( {id: id} ).$promise; },
    get: function( name, id, hardwareId  ) {
      var options = id ? {id: id} : {};
      if( hardwareId ) {
        options.hardwareId = hardwareId;
      }
      return HardwareResource.read( options ).$promise;
    }

  };
}]);