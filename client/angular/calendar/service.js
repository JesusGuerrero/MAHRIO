angular.module('baseApp.services').factory('CalendarResource', [ '$resource', function($resource) {
  'use strict';
  return $resource('/api/events/:id',
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
angular.module('baseApp.services').factory('Calendar', [ 'CalendarResource', function( CalendarResource) {
  'use strict';

  var currentEventId = null;
  return {
    addCoverImage: function( event, media ){
      return CalendarResource.update(
        {
          id: event._id
        },{
          event: {
            mediaInsert: media
          }
        }).$promise;
    },
    add: function( obj ) {
      return CalendarResource.create( {event: obj} ).$promise;
    },
    get: function( id, network ) {
      return CalendarResource.read( id ? {id: id} : {network: network} ).$promise;
    },
    update: function( obj ) {
      return CalendarResource.update( {id: obj._id}, {event: obj} ) .$promise;
    },
    remove: function(id){
      return CalendarResource.remove( {id: id} ).$promise;
    },
    currentEventId: currentEventId
  };
}]);