'use strict';

var User = require('mongoose').model('User'),
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

    reply({role: user.role})
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

function currentUser (request, reply, method) {
  User.findOne({_id: request.auth.credentials.id}, function (err, user) {
    if (err || !user) { return reply(Boom.unauthorized(err)); }

    switch( method ){
      case 'GET':
        return reply({role: user.role, email: user.email});
      case 'PUT':
      /*
       forEach( request.payload, function(k, v ){
        if( user.hasOwnProperty( k ) ){
          user[ k ] = v;
        }
       }
       user.save( function(err){
        if (err) { return reply(Boom.badRequest(err)); }

        return reply({updated: true});
       });
       */
        return reply('coming soon');
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