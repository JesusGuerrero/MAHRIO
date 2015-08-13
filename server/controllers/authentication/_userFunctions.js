'use strict';

var async = require('async'),
    _ = require('underscore'),
    http = require('request'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Media = mongoose.model('Media'),
    Boom = require('boom');

var crypto = require('crypto');

function register (request, reply, config, server) {
  if (request.auth.isAuthenticated) { return reply(Boom.badRequest('You Logged In')); }

  var newUser = new User({
    email: request.payload.email,
    password: request.payload.password,
    access: !server.needAdmin ? 'authorized' : 'admin'
  });

  if( server.needAdmin ){
    server.needAdmin = false;
  }

  newUser.save(function (err, user) {
    if (err) { return reply(Boom.badRequest(err)); }

    var confirmAccountLink = config.DOMAIN + '/#/confirm/';
    confirmAccountLink += user.resetPasswordToken+'?user=true';
    server.mailer( {to: user.email, subject: 'Activate Account', html: confirmAccountLink});
    console.log( confirmAccountLink );

    delete user.authorizationToken;
    delete user.password;
    delete user.resetPasswordToken;
    delete user.salt;

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
function addAvatar( request, reply ) {
  try {
    request.payload.media._owner = request.auth.credentials.id;
    var media = new Media( request.payload.media );
    media.save( function(err, media){
      if( err ) return reply( Boom.badRequest(err) );

      request.payload.avatarImage = media.id;
      return currentUser( request, reply, 'PUT', 'avatarImage' );
    });
  } catch (e) {
    return reply( Boom.badRequest(e) );
  }
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
      server.mailer( {to: request.payload.email, subject: 'Password Reset', html: link});
    }
    reply({reset: true});
  });
}

function passwordReset( request, reply ){
  User.resetPassword( request.payload.token, request.payload.newPassword,
    function(err, user){
      if( err ){ return reply(Boom.badRequest(err)); }

      reply({role: user.role, email: user.email, firstName: user.firstName, lastName: user.lastName})
        .header('Authorization', 'Bearer ' + user.authorizationToken)
        .header('Access-Control-Expose-Headers', 'authorization');
    });
}
function logout (request, reply) {
  if (request.auth.isAuthenticated) {
    User.findOne( {authorizationToken: request.auth.credentials.token}, function(err, user) {
      if( err ) { return reply( Boom.badRequest() ); }

      user.authorizationToken = null;
      user.save( function(err) {
        if( err ) { return reply( Boom.badRequest()); }
        reply({logout: true});
      });
    });
  }else{
    reply({logout: true});
  }
}

function currentUser (request, reply, method, selectString) {
  /*jshint maxcomplexity:20 */
  User
    .findOne({_id: request.auth.credentials.id})
    .select( selectString )
    .populate( 'avatarImage' )
    .exec( function (err, user) {
      if (err || !user) { return reply(Boom.badRequest(err)); }

      function completeUserSave(){
        var returnedUser = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        };
        user.save( function(err){
          if (err) { return reply(Boom.badRequest(err)); }

          return reply({user: returnedUser});
        });
      }

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
            completeUserSave();
          } else if( typeof request.payload.password === 'undefined' && typeof request.payload.email === 'undefined' ) {
            var copyFields = function (){
              async.forEach( Object.keys( request.payload ), function( key ){
                if( !_.contains(['email', 'role', 'salt', 'password'], key ) ) {
                  user[ key ] = request.payload[ key ];
                }
              });
              completeUserSave();
            };
            if( user.avatarImage && user.avatarImage.id ) {
              Media.remove( {_id: user.avatarImage.id}, function(err){
                if (err ) { return reply(Boom.badRequest(err)); }
                // TODO : AWS REMOVE
                copyFields();
              })
            } else {
              copyFields();
            }
          } else {
            return reply( Boom.badRequest() );
          }
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
function findUserForOauth( emailAddress, reply ) {
  User.findOne({email: emailAddress}, function (err, user) {
    if (err) {
      return reply(Boom.badData(err));
    }
    if (!user) {
      var newUser = new User({
        email: emailAddress,
        password: crypto.randomBytes(20).toString('hex'),
        role: 'admin'
      });
      newUser.save(function (err, user2) {
        if (err) {
          return reply(Boom.badRequest(err));
        }

        var response = '<html><body></body><script>window.localStorage.Role="admin";window.localStorage.Authorization="Bearer ';
        response += user2.authorizationToken + '";window.location.href="/";</script></html>';
        return reply(response);
      });
    } else {
      user.authorizationToken = crypto.randomBytes(20).toString('hex');
      user.save(function (err, user) {
        if (err) {
          return reply(Boom.badRequest(err));
        }

        var response = '<html><body></body><script>window.localStorage.Role="admin";window.localStorage.Authorization="Bearer ';
        response += user.authorizationToken + '";window.location.href="/";</script></html>';
        return reply(response);
      });
    }
  });
}
function loginThroughOauth(request, reply, party, config) {
  if( request.query.error && request.query.error === 'access_denied'){
    return reply.redirect('/#login?error='+request.query.error );
  }
  /*jshint camelcase: false */
  var linkedIn = {
    oauth: {
      client_id: config.IN_CLIENT_ID,
      client_secret: config.IN_CLIENT_SECRET,
      redirect_uri: config.IN_CALLBACK_URL,
      grant_type: 'authorization_code',
      code: request.query.code
    },
    url: 'https://www.linkedin.com/uas/oauth2/accessToken'
  };
  var facebook = {
    oauth: {
      client_id: config.FB_CLIENT_ID,
      client_secret: config.FB_CLIENT_SECRET,
      redirect_uri: config.FB_CALLBACK_URL,
      grant_type: 'authorization_code',
      code: request.query.code
    },
    url: 'https://graph.facebook.com/v2.3/oauth/access_token?',
    graph: 'https://graph.facebook.com/v2.3/me?scope=email'
  };
  switch( party ) {
    case 'facebook':
      http.get( {
        url: facebook.url,
        qs: facebook.oauth
      }, function(err, httpResponse, body){
        var firstBody = body;
        http.get({
          url: 'https://graph.facebook.com/v2.3/me?scope=email',
          headers: {
            Authorization: 'Bearer ' + JSON.parse(firstBody).access_token
          }
        }, function(err, httpResponse, body) {
          try {
            findUserForOauth( JSON.parse(body).email, reply );
          } catch(e){
            reply('FAILED');
          }
        });
      });
      break;
    case 'linkedin':
      http.post( {
        url: linkedIn.url,
        form: linkedIn.oauth
      }, function(err, httpResponse, body){
        var firstBody = body;
        http.get({
          url: 'https://api.linkedin.com/v1/people/~:(first-name,last-name,headline,location,industry,picture-url,email-address)?format=json',
          headers: {
            Authorization: 'Bearer ' + JSON.parse(firstBody).access_token
          }
        }, function(err, httpResponse, body) {
          try {
            findUserForOauth( JSON.parse(body).emailAddress, reply);
          } catch(e){
            reply('FAILED');
          }
        });
      });
      break;
    default:
      return reply( Boom.badImplementation() );
  }
}

module.exports = {
  login: login,
  register: register,
  activateUser: activateUser,
  addAvatar: addAvatar,
  recoverPassword: recoverPassword,
  isValidToken: isValidToken,
  passwordReset: passwordReset,
  logout: logout,
  currentUser: currentUser,
  getUsers: getUsers,
  getUser: getUser,
  loginThroughOauth: loginThroughOauth
};