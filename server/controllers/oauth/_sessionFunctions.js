'use strict';

var async = require('async'),
    _ = require('underscore'),
    http = require('request'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Media = mongoose.model('Media'),
    Boom = require('boom');

var crypto = require('crypto');

function login (request, reply) {
  if (request.auth.isAuthenticated) { return reply(Boom.badRequest('You Logged In')); }

  User.login(request.payload.email, request.payload.password, function (err, user) {
    if (err) { return reply(Boom.badRequest(err)); }

    reply({success: true})
      .header('Authorization', 'Bearer ' + user.authorizationToken)
      .header('Access-Control-Expose-Headers', 'authorization');
  });
}

function isValidToken( request, reply ){
  User.findOne( { resetPasswordToken: request.payload.token}, function(err, user){
    if( err || !user ){ return reply(Boom.badRequest(err)); }

    reply({validToken: true});
  });
}

function recoverPassword( request, reply, config, server ){
  User.recoverPassword( request.payload.email, function(err, user){
    if( user && user.token ){
      var link = config.DOMAIN + '/#/passwordreset/'+user.token;
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

      reply({access: user.access, email: user.email})
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
function findUserForOauth( emailAddress, reply ) {
  User.findOne({email: emailAddress}, function (err, user) {
    if (err) {
      return reply(Boom.badData(err));
    }
    if (!user) {
      var newUser = new User({
        email: emailAddress,
        password: crypto.randomBytes(20).toString('hex'),
        access: 'authorized'
      });
      newUser.save(function (err, user2) {
        if (err) {
          return reply(Boom.badRequest(err));
        }

        var response = '<html><body></body><script>window.localStorage.Access="admin";window.localStorage.Authorization="Bearer ';
        response += user2.authorizationToken + '";window.location.href="/";</script></html>';
        return reply(response);
      });
    } else {
      user.authorizationToken = crypto.randomBytes(20).toString('hex');
      user.save(function (err, user) {
        if (err) {
          return reply(Boom.badRequest(err));
        }

        var response = '<html><body></body><script>window.localStorage.Access="admin";window.localStorage.Authorization="Bearer ';
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
  recoverPassword: recoverPassword,
  isValidToken: isValidToken,
  passwordReset: passwordReset,
  logout: logout,
  loginThroughOauth: loginThroughOauth
};