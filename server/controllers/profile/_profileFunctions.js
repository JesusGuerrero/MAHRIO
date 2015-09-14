'use strict';

var async = require('async'),
  Boom = require('boom'),
  mongoose = require('mongoose'),
  Profile = mongoose.model('Profile'),
  User = mongoose.model('User');

function getProfile( request, reply, next ) {
  Profile.findOne({_owner: request.auth.credentials.id}, function(err,profile){
    if( err ) { return reply( Boom.badRequest(err) ); }

    if( typeof next === 'function' ) {
      next( profile );
    } else {
      if( profile ) {
        reply({profile: profile});
      } else {
        reply( {profile: {firstName:'', lastName:''}});
      }
    }
  });
}
function updateProfile( request, reply ) {
  getProfile( request, reply, function( profile ) {
    if (profile === null) {
      request.payload.profile._owner = request.auth.credentials.id;
      profile = new Profile( request.payload.profile );
      profile.save( function( err, profile ){
        User.findOne({_id: request.auth.credentials.id}, function(err, user){
          user.profile = profile.id;
          user.save( function(){
            reply( {profile: profile});
          });
        });
      });
    } else {
      async.forEach( Object.keys( request.payload.profile ), function( key ){
        profile[ key ] = request.payload.profile[ key ];
      });

      profile.save(function (err, profile) {
        if (err) { return reply(Boom.badRequest(err)); }

        reply({profile: profile});
      });
    }
  });
}


module.exports = {
  get: getProfile,
  update: updateProfile
};