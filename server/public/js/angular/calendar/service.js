angular.module('baseApp.services').factory('CalendarResource', [ '$resource', function($resource) {
  'use strict';
  return $resource('/api/calendar/events/:action',
    { action: '@action' },
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
  var eventSchema = {
    title: '',
    start: null,
    end: null,
    allDay: false,
    url: '',
    backgroundColor: '#3c8dbc',
    borderColor: '#3c8dbc'
  }, currentEvent = null;
  return {
    getOneEvent: function( eventId ) {
      return CalendarResource.read( {action: eventId }).$promise;
    },
    getEvents: function(){
      return CalendarResource.read( {action: 'all'}).$promise;
    },
    createEvent: function( eventObject ){
      var newEvent = $.extend( angular.copy(eventSchema), eventObject );
      return CalendarResource.create( {}, {event: newEvent}).$promise;
    },
    updateEvent: function( eventObject ) {
      return CalendarResource.update( {action: eventObject._id}, {event: eventObject}).$promise;
    },
    removeEvent: function( eventId ) {
      return CalendarResource.remove( {action: eventId }).$promise;
    },
    currentEvent: currentEvent
  };
}]);
