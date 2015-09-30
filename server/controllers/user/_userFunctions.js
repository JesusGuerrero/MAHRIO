'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Media = mongoose.model('Media'),
    Boom = require('boom'),
    Profile = mongoose.model('Profile');

function register (request, reply, config, server) {
  if (request.auth.isAuthenticated) { return reply(Boom.badRequest('You Logged In')); }

  var newUser = new User({
    email: request.payload.email,
    password: request.payload.password,
    access: !server.needAdmin ? ['authorized'] : ['authorized','sudo']
  });

  if( server.needAdmin ){
    server.needAdmin = false;
  }

  Profile.create({firstName: request.payload.profile.firstName, lastName: request.payload.profile.lastName},
    function( err, profile ){
      if( err ) { return reply( Boom.badRequest(err)); }

      newUser.profile = profile.id;
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

        profile._owner = user.id;
        profile.save( function(err){
          if( err ) { return reply( Boom.badRequest(err)); }

          reply({created: user.created, email: user.email, profile: {firstName: profile.firstName, lastName: profile.lastName}, access: user.access })
            .header('Authorization', 'Bearer ' + user.authorizationToken)
            .header('Access-Control-Expose-Headers', 'authorization');
        });
      });

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
    media.save( function(err, media) {
      if (err) { return reply(Boom.badRequest(err)); }

      User
        .findOne({_id: request.auth.credentials.id}, function (err, user) {
          if (err || !user) {
            return reply(Boom.badRequest(err));
          }
          user.avatarImage = media.id;

          user.save(function (err, user) {
            reply({user: user});
          });
        });
    });
  } catch (e) {
    return reply( Boom.badRequest(e) );
  }
}

function currentUser (request, reply, method, selectString) {
  /*jshint maxcomplexity:20 */
  User
    .findOne({_id: request.auth.credentials.id})
    .select( selectString )
    .populate( 'avatarImage profile networks' )
    .exec( function (err, user) {
      if (err || !user) { return reply(Boom.badRequest(err)); }

      var returnedUser;
      function completeUserSave(){
        returnedUser = {
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
          if( typeof user.profile === 'undefined' ) {
            user.profile = {firstName:'', lastName: ''};
          }
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
            user.save( function(err){
              if (err) { return reply(Boom.badRequest(err)); }

              return reply({user: returnedUser});
            });
          } else if( typeof request.payload.password === 'undefined' && typeof request.payload.email === 'undefined' ) {
            var copyFields = function (){
              completeUserSave();
            };
            if( user.avatarImage && user.avatarImage.id ) {
              Media.remove( {_id: user.avatarImage.id}, function(err){
                if (err ) { return reply(Boom.badRequest(err)); }
                // TODO : AWS REMOVE
                copyFields();
              });
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
  User
    .find()
    .select('email profile avatarImage')
    .populate('profile avatarImage')
    .exec( function (err, users) {
      if (err || !users) {
        return reply(Boom.badRequest(err));
      }

      return reply({
        list: users
      });
    });
}

function getUser( id, reply ){
  User.findOne({_id: id})
    .select('email avatarImage profile')
    .populate('avatarImage profile')
    .exec( function (err, user) {
      if (err) { return reply(Boom.badRequest(err)); }

      reply( {user: user} );
    });
}

module.exports = {
  register: register,
  activateUser: activateUser,
  addAvatar: addAvatar,
  currentUser: currentUser,
  getUsers: getUsers,
  getUser: getUser
};