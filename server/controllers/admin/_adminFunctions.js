'use strict';

var User = require('mongoose').model('User'),
    _ = require('underscore'),
    Boom = require('boom');

function remove(request, reply){
  if( !_.contains(request.auth.credentials.access, 'sudo') || request.auth.credentials.id !== request.params.id ){
    return reply( Boom.unauthorized('unauthorized'));
  }

  User.remove( {_id: request.params.id}, function(err){
    if (err ) { return reply(Boom.badRequest(err)); }

    reply( {removed: true} );
  });
}
function disable( request, reply ) {
  if( !_.contains(request.auth.credentials.access, 'sudo') || request.auth.credentials.id !== request.params.id ){
    return reply( Boom.unauthorized('unauthorized'));
  }

  User.update( {_id: request.params.id}, {$set: {disabled: true}}, {multi: false}, function(err){
    if( err ) { return reply( Boom.badRequest(err)); }

    return reply( {disabled: true} );
  });
}
module.exports = {
  removeUser: remove,
  disableUser: disable
};