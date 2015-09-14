'use strict';

var Boom = require('boom'),
  mongoose = require('mongoose'),
  _ = require('underscore'),
  async = require('async'),
  Notice = mongoose.model('Notification'),
  Conversation = mongoose.model('Conversation'),
  Media = mongoose.model('Media'),
  Profile = mongoose.model('Profile');

function get( request, reply ) {
  Notice
    .find( { _user: request.auth.credentials.id })
    .exec( function(err, notifications){
      if( err ) { return reply( Boom.badRequest() ); }

      var groupedByResource = _.groupBy( notifications, function(entry) { return entry.resource; });
      _.forEach( groupedByResource, function( entry, key ) {
        groupedByResource[key] = _.groupBy( entry, function(item){ return item.id; });
      });
      if( 'chat' in groupedByResource ) {
        async.each( Object.keys(groupedByResource.chat), function(key, callback) {
          Conversation
            .findOne({_id: key })
            .populate([{
              path: 'members',
              select: 'email profile avatarImage'
            },{
              path: 'messages',
              options: { sort: { 'created': -1 }, limit: 1 }
            }])
            .exec( function (err, conv) {
              conv.members = _.filter( conv.members, function(item){ return item.id !== request.auth.credentials.id; });
              async.forEach(conv.members ,function(item,callback) {
                if( item.avatarImage ) {
                  Media.populate( item,{ 'path': 'avatarImage' },function(err) {
                    if (err) { return reply( Boom.badRequest(err)); }

                    callback();
                  });
                } else {
                  callback();
                }
              }, function() {
                async.forEach(conv.members ,function(item,callback) {
                  if( item.profile ) {
                    Profile.populate( item,{ 'path': 'profile' },function(err) {
                      if (err) { return reply( Boom.badRequest(err)); }

                      callback();
                    });
                  } else {
                    callback();
                  }
                }, function() {
                  groupedByResource.chat[ key ]  = conv;
                  callback();
                });
              });
            });
        }, function(){
          reply( {notifications: groupedByResource} );
        });
      } else {
        reply( {notifications: notifications} );
      }
    });
}

module.exports = {
  get: get
};