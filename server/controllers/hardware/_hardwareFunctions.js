'use strict';

var async = require('async'),
  _ = require('underscore'),
  Boom = require('boom'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Hardware = mongoose.model('Hardware'),
  Media = mongoose.model('Media');

function createHardware( request, reply ) {
  if( !request.payload.hardware || !_.contains(request.auth.credentials.access, 'sudo') ) {
    return reply( Boom.badRequest() );
  }
  Hardware.create( request.payload.hardware, function(err, raspberry){
    if( err ) { return reply( Boom.badRequest(err) ); }

    return reply({device: raspberry});

  });
}
function _getHardwareOwner( hardware, callback ) {
  User
    .findOne( {_id: hardware.creator})
    .select('email profile avatarImage')
    .populate('profile avatarImage')
    .exec( function(err, user){
      if( err ) { callback(err); }

      hardware._doc.owner = user;

      callback( false );
    });
}
function _getAllHardware( request, reply, callback ) {
  Hardware
    .find( request.query.hardwareId ? {_id: request.query.hardwareId} : {} )
    .populate('coverImage')
    .exec( function(err, devices){
      if( err ) { return reply( Boom.badRequest(err) ); }

      if( typeof callback !== 'undefined' ) {
        callback( devices );
      } else {
        return reply({devices: devices});
      }
    });
}
function getDevices( request, reply, callback ) {
  if( typeof request.params.id === 'undefined' ) {
    _getAllHardware( request, reply, function(devices){
      async.each( devices, function(hardware, callback){
        _getHardwareOwner( hardware, function(err){
          if( err ) { return reply( Boom.badRequest() ); }

          callback();
        });
      }, function(){
        return reply( {devices: _.indexBy(devices, '_id') } );
      });
    });
  } else {
    Hardware
      .findOne( {_id: request.params.id} )
      .exec( function(err, hardware){
        if( err ) { return reply( Boom.badRequest(err) ); }

        _getHardwareOwner( hardware, function(err){
          if( err ) { return reply( Boom.badRequest() ); }

          if( typeof callback !== 'undefined' ) {
            callback( hardware );
          } else {
            return reply( {hardware: hardware} );
          }
        });
      });
  }
}
function _updateImage( request, reply ) {
  Media
    .create( request.payload.hardware.mediaInsert, function(err, media){
      if( err ) { return reply( Boom.badRequest(err) ); }

      Hardware.update({_id: request.params.id}, {$set: {coverImage: media.id}}, {multi: false},
        function(err, hardware){
          if( err || !hardware ){ return reply( Boom.badRequest('failed to update hardware with image'+err)); }

          return reply({media: media});
        });
    });
}
function updateHardware( request, reply ) {
  if( !request.payload.hardware || (!_.contains(request.auth.credentials.access, 'sudo') && !_.contains(request.auth.credentials.access, 'admin')) || typeof request.params.id === 'undefined') {
    return reply(Boom.badRequest());
  } else if( request.payload.hardware.mediaInsert ) {
    _updateImage( request, reply );
  } else {
    getDevices( request, reply, function(hardware) {
      if (!hardware) {
        return reply(Boom.badRequest('article not found'));
      }

      hardware.title = request.payload.hardware.title;
      hardware.type = request.payload.hardware.type;
      hardware.ip = request.payload.hardware.ip;
      hardware.port = request.payload.hardware.port;

      hardware.save( function(err, hardware) {
        if( err ) { return reply( Boom.badRequest(err) ); }

        reply( {device: hardware} );
      });
    });
  }
}
function removeHardware( request, reply ){
  if( !_.contains(request.auth.credentials.access, 'sudo') && !_.contains(request.auth.credentials.access, 'admin') ) {
    return reply( Boom.badRequest() );
  }
  if( typeof request.params.id !== 'undefined' ) {
    getDevices( request, reply, function(hardware){
      if( hardware ) {
        Hardware.remove({_id: request.params.id}, function (err) {
          if (err) { return reply(Boom.badRequest()); }

          return reply({removed: true});
        });
      } else {
        return reply( Boom.badRequest() );
      }
    });
  } else {
    return reply( Boom.badRequest() );
  }
}
module.exports = {
  get: getDevices,
  update: updateHardware,
  remove: removeHardware,
  create: createHardware
};