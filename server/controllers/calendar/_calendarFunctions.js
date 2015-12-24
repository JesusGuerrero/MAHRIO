'use strict';

var Boom = require('boom'),
  mongoose = require('mongoose'),
  async = require('async'),
  _ = require('underscore'),
  User = mongoose.model('User'),
  Media = mongoose.model('Media'),
  CalendarEvent = mongoose.model('CalendarEvent');

function createEvent( request, reply ) {
  if( !request.payload.event || (!_.contains(request.auth.credentials.access, 'admin')&&!_.contains(request.auth.credentials.access, 'sudo')) ) {
    return reply( Boom.badRequest() );
  }

  request.payload.event.creator = request.auth.credentials.id;
  CalendarEvent.create( request.payload.event, function(err, event){
    if( err ) { return reply( Boom.badRequest(err) ); }

    return reply({event: event});
  });
}
function _getEventInvites( event, callback ) {
  User
    .find( {_id: {$in: event.invited}})
    .select('email profile avatarImage')
    .populate('profile avatarImage')
    .exec( function(err, users){
      if( err ) { callback(err); }

      event._doc.invited = _.indexBy( users, '_id');

      callback( false );
    });
}
function _getAllEvents( request, reply, callback ) {
  var networks = {network: request.query.network};
  if( typeof request.query.network === 'undefined') {
    networks.network = {$in : request.auth.credentials.networks};
  }
  CalendarEvent
    .find( networks )
    .populate('coverImage network')
    .exec( function(err, events){
      if( err ) { return reply( Boom.badRequest(err) ); }

      if( typeof callback !== 'undefined' ) {
        callback( events );
      } else {
        return reply({events: events});
      }
    });
}
function getEvent( request, reply, callback ) {
  if( typeof request.params.id === 'undefined' ) {
    _getAllEvents( request, reply, function(events){
      async.each( events, function(event, callback){
        _getEventInvites( event, function(err){
          if( err ) { return reply( Boom.badRequest() ); }

          callback();
        });
      }, function(){
        return reply( {events: events} );
      });
    });
  } else {
    CalendarEvent
      .findOne( {_id: request.params.id} )
      .exec( function(err, event){
        if( err ) { return reply( Boom.badRequest(err) ); }

        _getEventInvites( event, function(err){
          if( err ) { return reply( Boom.badRequest() ); }

          if( typeof callback !== 'undefined' ) {
            callback( event );
          } else {
            return reply( {event: event} );
          }
        });
      });
  }
}
function _updateImage( request, reply ) {
  Media
    .create( request.payload.event.mediaInsert, function(err, media){
      if( err ) { return reply( Boom.badRequest(err) ); }

      CalendarEvent.update({_id: request.params.id}, {$set: {coverImage: media.id}}, {multi: false},
        function(err, event){
          if( err || !event ){ return reply( Boom.badRequest('failed to update article with image'+err)); }

          return reply({media: media});
        });
    });
}
function updateEvent( request, reply ) {
  if( !request.payload.event || (!_.contains(request.auth.credentials.access, 'sudo') && !_.contains(request.auth.credentials.access, 'admin')) || typeof request.params.id === 'undefined') {
    return reply( Boom.badRequest() );
  } else if( request.payload.event.mediaInsert ) {
    _updateImage(request, reply);
  } else if( typeof request.payload.eventIds !== 'undefined' && Array.isArray( request.payload.eventIds ) ) {
    // TODO: update several networks at once
  } else {
    getEvent( request, reply, function(event){

      event.title = request.payload.event.title;
      event.description = request.payload.event.description;
      event.start = request.payload.event.start;
      event.deck = request.payload.event.deck;
      event.locationName = request.payload.event.locationName;
      event.locationAddress = request.payload.event.locationAddress;
      event.maxRsvp = request.payload.event.maxRsvp;
      event.end = request.payload.event.end;
      event.allDay = request.payload.event.allDay;
      event.url = request.payload.event.url;
      event.color = request.payload.event.color;
      event.isPrivate = request.payload.event.isPrivate;
      event.invited = request.payload.event.invited;

      event.save( function(err, event){
        if( err ) { return reply( Boom.badRequest(err) ); }

        return reply( {event: event} );
      });
    });
  }
}
function removeEvent( request, reply ){
  if( !_.contains(request.auth.credentials.access, 'sudo') && !_.contains(request.auth.credentials.access, 'admin') ) {
    return reply( Boom.badRequest() );
  }
  if( typeof request.params.id !== 'undefined' ) {
    CalendarEvent.remove({_id: request.params.id}, function (err) {
      if (err) { return reply(Boom.badRequest()); }

      return reply({removed: true});
    });
  } else {
    return reply( Boom.badRequest() );
  }
}
module.exports = {
  create: createEvent,
  read: getEvent,
  update: updateEvent,
  remove: removeEvent
};