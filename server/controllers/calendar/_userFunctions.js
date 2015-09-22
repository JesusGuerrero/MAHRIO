'use strict';

var Boom = require('boom'),
  mongoose = require('mongoose'),
  CalendarEvent = mongoose.model('CalendarEvent');

function getEvents(request, reply) {
  CalendarEvent
    .find({_user: request.auth.credentials.id})
    .lean()
    .limit( 10 )
    .exec( function(err, events) {
      if (err) {
        return reply(Boom.badRequest('bad request'));
      }

      return reply({events: events});
    });
}
function getOneEvent( id, reply ){
  CalendarEvent
    .findOne( {_id : id })
    .lean()
    .exec( function(err, event){
      if( err ){
        return reply( Boom.badRequest('bad request'));
      }

      return reply( {event: event} );
    });
}
function newEvent(request, reply) {
  new CalendarEvent({
    title: request.payload.event.title || '',
    start: request.payload.event.start ? request.payload.event.start : null,
    end: request.payload.event.end ? request.payload.event.end : null,
    allDay: request.payload.event.allDay || false,
    url: request.payload.event.url || '',
    color: request.payload.event.color || '',
    _user: request.auth.credentials.id
  }).save( function(err, event) {
      if (err) { return reply(Boom.badRequest(err)); }

      return reply({save: true, event: event});
    });
}
function updateEvent( request, reply ) {
  CalendarEvent
    .findById( request.params.id, function(err, event){
      if (err || !event) { return reply(Boom.badRequest(err)); }

      event.title = request.payload.event.title || event.title;
      event.start = request.payload.event.start || event.start;
      event.end = request.payload.event.end || event.end;
      event.allDay = request.payload.event.allDay;

      event.save( function(err, event) {
        if (err) { return reply(Boom.badRequest(err)); }

        return reply({updated: true, event: event});
      });
    });
}
function removeEvent(request, reply) {
  CalendarEvent
    .findById( request.params.id, function(err, entry){
      if (err || !entry) { return reply(Boom.badRequest(err)); }

      entry.remove();

      reply({removed: true});
    });
}
module.exports = {
  getEvents: getEvents,
  getOneEvent: getOneEvent,
  newEvent: newEvent,
  updateEvent: updateEvent,
  removeEvent: removeEvent
};