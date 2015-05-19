'use strict';

var User = require('mongoose').model('User'),
    Boom = require('boom');

function remove(request, reply){
  if( request.auth.credentials.role !== 'admin' || request.auth.credentials.id !== request.params.id ){
    return reply( Boom.unauthorized('unauthorized'));
  }

  User.findById( request.params.id, function(err, entry){
    if (err || !entry) { return reply(Boom.badRequest(err)); }

    entry.remove();

    reply({removed: true});
  });
}
function becomeUser(  ){
  //Find User, authenticate as User
}
function updateUser( request, reply ){
  if( request.auth.credentials.role !== 'admin' ) {
    return reply( Boom.unauthorized('unauthorized'));
  }

  User.findOne({email: request.payload.email}, function (err, user) {
    if (err || !user) { return reply(Boom.badRequest(err)); }

    user.role = request.payload.role;

    user.save( function(err){
      if (err) { return reply(Boom.badRequest(err)); }

      return reply({updated: true});
    });
  });

}

module.exports = {
  removeUser: remove,
  becomeUser: becomeUser,
  updateUser: updateUser
};