'use strict';

var CalendarCtrl = require('./_calendarFunctions');

module.exports = function(config, server) {
  [
    {
      method: ['GET'],
      path: '/api/events/{id?}',
      config: {
        handler: CalendarCtrl.read,
        auth: 'simple'
      }
    },
    {
      method: ['POST'],
      path: '/api/events',
      config: {
        handler: CalendarCtrl.create,
        auth: 'simple'
      }
    },
    {
      method: ['PUT'],
      path: '/api/events/{id?}',
      config: {
        handler: CalendarCtrl.update,
        auth: 'simple'
      }
    },
    {
      method: ['DELETE'],
      path: '/api/events/{id?}',
      config: {
        handler: CalendarCtrl.remove,
        auth: 'simple'
      }
    }
  ].forEach(function (route) { server.route(route); });
};
//var userCalendarMethods = require('./_userFunctions');
//
//module.exports = function(config, server) {
//  [
//    {
//      method: ['GET'],
//      path: '/calendar',
//      config: {
//        handler: function( request, reply ) {
//          reply.view('pages/_calendar');
//        }
//      }
//    },
//    {
//      method: ['GET'],
//      path: '/api/calendar/events/{action?}',
//      config: {
//        handler: function(request, reply){
//          switch( request.params.action ){
//            case 'all':
//              return userCalendarMethods.getEvents(request, reply);
//            default:
//              var idInActionParameter = request.params.action ? request.params.action : null;
//              return userCalendarMethods.getOneEvent( idInActionParameter, reply );
//          }
//        },
//        auth: 'simple'
//      }
//    },
//    {
//      method: ['POST'],
//      path: '/api/calendar/events',
//      config: {
//        handler: userCalendarMethods.newEvent,
//        auth: 'simple'
//      }
//    },
//    {
//      method: ['PUT'],
//      path: '/api/calendar/events/{id?}',
//      config: {
//        handler: userCalendarMethods.updateEvent,
//        auth: 'simple'
//      }
//    },
//    {
//      method: ['DELETE'],
//      path: '/api/calendar/events/{id}',
//      config: {
//        handler: userCalendarMethods.removeEvent,
//        auth: 'simple'
//      }
//    }
//  ].forEach(function (route) { server.route(route); });
//};