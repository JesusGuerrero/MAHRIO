'use strict';

var Boom = require('boom'),
  mongoose = require('mongoose'),
  _ = require('underscore'),
  async = require('async'),
  Notice = mongoose.model('Notification'),
  Conversation = mongoose.model('Conversation'),
  User = mongoose.model('User');

function get( request, reply ) {
  Notice
    .find( {_user: request.auth.credentials.id} )
    .lean()
    .exec( function(err, notices){
      if( err ) { return reply( Boom.badRequest(err)); }

      var groupedByResource = _.groupBy( notices, function(entry) { return entry.resource; });
      async.each( Object.keys( groupedByResource ), function(key, itemCallback) {
        var indexedResourceByUniqueId = _.indexBy( groupedByResource[key], 'id');
        if( key === 'chat'){
          Conversation
            .find( {_id: {$in: Object.keys(indexedResourceByUniqueId)} } )
            .lean()
            .populate([{
              path:'messages',
              options: { sort: { 'created': -1}, limit: 1}
            }])
            .exec( function(err, conversations){
              if( err ) { return reply( Boom.badRequest(err) ); }

              async.each( conversations, function(chat, chatCallback){
                User
                  .find( {_id: {$in: chat.members}} )
                  .select( 'email avatarImage profile')
                  .populate( 'avatarImage profile' )
                  .lean()
                  .exec( function(err, users){
                    if( err ) { return reply( Boom.badRequest(err)); }

                    chat.members = _.indexBy( users, '_id');
                    chat.isNew = true;
                    chatCallback();
                  });
              }, function(){
                groupedByResource[key] = _.indexBy( conversations, '_id');
                itemCallback();
              });
            });
        } else if( key === 'mail' ) {
          // TODO:
        }
      }, function(){
        reply( {notifications: groupedByResource} );
      });
    });
}
function add( request, reply){
  Notice.create({
    resource: request.params.resource,
    id: request.payload.id,
    _user: request.auth.credentials.id
  }, function(err) {
    if( err ) { return reply( Boom.badRequest(err)); }

    return reply( {id: request.query.id });
  });
}
function remove( request, reply ){
  Notice.remove({id: request.query.id, resource: request.params.resource}, function(err){
    if( err ) { return reply( Boom.badRequest(err)); }

    reply( {id: request.query.id} );
  });
}

module.exports = {
  get: get,
  add: add,
  remove: remove
};