'use strict';

var async = require('async'),
    _ = require('underscore'),
    User = require('mongoose').model('User'),
    Boom = require('boom');

function register (request, reply, server) {
  if (request.auth.isAuthenticated) { return reply(Boom.badRequest('You Logged In')); }

  var newUser = new User({
    email: request.payload.email,
    password: request.payload.password,
    role: !server.needAdmin ? 'user' : 'admin'
  });

  if( server.needAdmin ){
    server.needAdmin = false;
  }

  newUser.save(function (err, user) {
    if (err) { return reply(Boom.badRequest(err)); }

    var confirmAccountLink = 'http://whichdegree.co/app#/confirm/';
    confirmAccountLink += user.resetPasswordToken+'?user=true';
    server.sendEmail( user.email, 'Activate Account', confirmAccountLink );
    console.log( confirmAccountLink );
    reply(user)
      .header('Authorization', 'Bearer ' + user.authorizationToken)
      .header('Access-Control-Expose-Headers', 'authorization');
  });
}

function login (request, reply) {
  if (request.auth.isAuthenticated) { return reply(Boom.badRequest('You Logged In')); }

  User.login(request.payload.email, request.payload.password, function (err, user) {
    if (err) { return reply(Boom.badRequest(err)); }

    reply({success: true})
      .header('Authorization', 'Bearer ' + user.authorizationToken)
      .header('Access-Control-Expose-Headers', 'authorization');
  });
}

function activateUser( request, reply ){
  User.findOne( { resetPasswordToken: request.payload.token}, function(err, user){
    if( err || !user ){ return reply(Boom.badRequest(err)); }

    user.confirmed = true;
    user.save(function (err) {
      if (err) { return reply(Boom.badRequest(err)); }
      reply({validToken: true});
    });
  });
}

function isValidToken( request, reply ){
  User.findOne( { resetPasswordToken: request.payload.token}, function(err, user){
    if( err || !user ){ return reply(Boom.badRequest(err)); }

    reply({validToken: true});
  });
}

function recoverPassword( request, reply, server ){
  User.recoverPassword( request.payload.email, function(err, user){
    if( user && user.token ){
      var link = 'http://whichdegree.co/app#/passwordreset/'+user.token;
      console.log( link );
      server.sendEmail( request.payload.email, 'Password Reset', link);
    }
    reply({reset: true});
  });
}

function passwordReset( request, reply ){
  User.resetPassword( request.payload.token, request.payload.newPassword,
    function(err, user){
      if( err ){ return reply(Boom.badRequest(err)); }

      reply({role: user.role})
        .header('Authorization', 'Bearer ' + user.authorizationToken)
        .header('Access-Control-Expose-Headers', 'authorization');
    });
}
function logout (request, reply) {
  if (request.auth.isAuthenticated) {
    var matchToken = {
      authorizationToken: request.auth.credentials.token
    };
    User.findAndModify( matchToken, [], {$set: {authorizationToken: null}},
      function () {
        reply({logout: true});
      });
  }else{
    reply({logout: true});
  }
}

function currentUser (request, reply, method, selectString) {
  /*jshint maxcomplexity:10 */
  User
    .findOne({_id: request.auth.credentials.id})
    .select( selectString )
    .exec( function (err, user) {
      if (err || !user) { return reply(Boom.badRequest(err)); }

      switch( method ){
        case 'GET':
          delete user.salt;
          delete user.password;
          return reply( { user: user });
        case 'PUT':
          if ( request.payload.password || request.payload.email ) {
            if( user.authenticate( request.payload.currentPassword ) ) {
              if( request.payload.email ) {
                user.email = request.payload.email;
              } else {
                user.updatePassword( request.payload.password || '' );
              }
            } else {
              return reply( Boom.badRequest() );
            }
          } else {
            async.forEach( Object.keys( request.payload ), function( key ){
              if( !_.contains(['email', 'role', 'salt', 'password'], key ) ) {
                user[ key ] = request.payload[ key ];
              }
            });
          }

          user.save( function(err){
            if (err) { return reply(Boom.badRequest(err)); }

            return reply({updated: true});
          });
          break;
        default:
          return reply( Boom.badRequest() );
      }
    });
}

function getUsers( request, reply ){
  User.find(function (err, users) {
    if (err || !users) {
      return reply(Boom.badRequest(err));
    }

    return reply({
      list: users
    });
  });
}

function getUser( id, reply ){
  User.findOne({_id: id}, function (err, user) {
    if (err || !user) { return reply(Boom.unauthorized(err)); }

    reply( user );
  });
}

module.exports = {
  login: login,
  register: register,
  activateUser: activateUser,
  recoverPassword: recoverPassword,
  isValidToken: isValidToken,
  passwordReset: passwordReset,
  logout: logout,
  currentUser: currentUser,
  getUsers: getUsers,
  getUser: getUser
};