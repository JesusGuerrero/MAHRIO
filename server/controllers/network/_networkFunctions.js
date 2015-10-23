'use strict';

var async = require('async'),
  _ = require('underscore'),
  Boom = require('boom'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Network = mongoose.model('Network'),
  Media = mongoose.model('Media');

function createNetwork( request, reply ) {
  if( !request.payload.network || (!_.contains(request.auth.credentials.access, 'sudo') && !_.contains(request.auth.credentials.access, 'admin') ) ) {
    return reply( Boom.badRequest() );
  }

  var members = request.payload.network.members;
  request.payload.network.members = Object.keys(_.indexBy(request.payload.network.members, '_id') );
  request.payload.network.admins = Object.keys(_.indexBy(request.payload.network.admins, '_id') );
  if( !request.payload.network.owner || !request.payload.network.owner._id ) {
    request.payload.network.owner = request.auth.credentials.id;
  }
  Network.create( request.payload.network, function(err, network){
    if( err ) { return reply( Boom.badRequest(err) ); }

    User.update( {_id: {$in: Object.keys(members) }}, {$push: {networks: network.id}}, {multi: true},
      function(err){
        if( err ) { return reply( Boom.badRequest(err) ); }

        return reply({network: network});
      });
  });
}
function _getNetworkOwner( network, callback ) {
  if( network.owner ) {
    User
      .findOne( {_id: network.owner})
      .select('email profile avatarImage')
      .populate('profile avatarImage')
      .exec( function(err, user){
        if( err ) { callback(err); }

        network._doc.owner = user;

        callback( false );
      });
  } else {
    callback( false );
  }
}
function _getNetworkAdmins( network, callback ) {
  User
    .find( {_id: {$in: network.admins}})
    .select('email profile avatarImage')
    .populate('profile avatarImage')
    .exec( function(err, users){
      if( err ) { callback(err); }

      network._doc.admins = _.indexBy( users, '_id');

      callback( false );
    });
}
function _getNetworkMembers( network, callback ) {
  User
    .find( {networks: {$in: [network.id]}})
    .select('email profile avatarImage')
    .populate('profile avatarImage')
    .exec( function(err, users){
      if( err ) { callback(err); }

      network._doc.members = _.indexBy( users, '_id');

      _getNetworkAdmins( network, function(){
        _getNetworkOwner( network, function(){
          callback( false );
        });
      });
    });
}
function _getAllNetworks( request, reply, callback ) {
  Network
    .find( request.payload.access )
    .exec( function(err, networks){
      if( err ) { return reply( Boom.badRequest(err) ); }

      if( typeof callback !== 'undefined' ) {
        callback( networks );
      } else {
        return reply({networks: networks});
      }
    });
}
function getNetwork( request, reply, callback ) {
  if( !_.contains(request.auth.credentials.access, 'authorized') ) {
    return reply( Boom.badRequest() );
  }
  if( !_.contains(request.auth.credentials.access, 'sudo') ) {
    if( !request.payload ) {
      request.payload = { access: { isPrivate: false } };
    } else {
      request.payload.access = { isPrivate: false };
    }
  } else {
    if( !request.payload ) {
      request.payload = {access: {}};
    } else {
      request.payload.access = { };
    }
  }
  if( typeof request.params.id === 'undefined' ) {
    _getAllNetworks( request, reply, function(networks){
      async.each( networks, function(network, callback){
        _getNetworkMembers( network, function(err){
          if( err ) { return reply( Boom.badRequest() ); }

          callback();
        });
      }, function(){
        return reply( {networks: networks} );
      });
    });
  } else {
    request.payload.access._id = request.params.id;
    Network
      .findOne( request.payload.access  )
      .populate('coverImage')
      .exec( function(err,network){
        if( err ) { return reply( Boom.badRequest(err) ); }

        _getNetworkMembers( network, function(err){
          if( err ) { return reply( Boom.badRequest() ); }

          if( typeof callback !== 'undefined' ) {
            callback( network );
          } else {
            return reply( {network: network} );
          }
        });
      });
  }
}
function _updateImage( request, reply ) {
  Media
    .create( request.payload.network.mediaInsert, function(err, media){
      if( err ) { return reply( Boom.badRequest(err) ); }

      Network.update({_id: request.params.id}, {$set: {coverImage: media.id}}, {multi: false},
        function(err, network){
          if( err || !network ){ return reply( Boom.badRequest('failed to update article with image'+err)); }

          return reply({media: media});
        });
    });
}
function updateNetwork( request, reply ) {
  if( !request.payload.network || (!_.contains(request.auth.credentials.access, 'sudo') && !_.contains(request.auth.credentials.access, 'admin')) || typeof request.params.id === 'undefined') {
    return reply( Boom.badRequest() );
  } else if( request.payload.network.mediaInsert ) {
    _updateImage(request, reply);
  } else if( typeof request.payload.networkIds !== 'undefined' && Array.isArray( request.payload.networkIds ) ) {
    // TODO: update several networks at once
  } else {
    getNetwork( request, reply, function(network){

      network.name = request.payload.network.name;
      network.isPrivate = request.payload.network.isPrivate;
      network.isProtected = request.payload.network.isProtected;
      network.admins = request.payload.network.admins;
      network.owner = undefined;
      if( request.payload.network.owner && request.payload.network.owner._id ) {
        network.owner = request.payload.network.owner._id;
      }

      network.save( function(err, network){
        if( err ) { return reply( Boom.badRequest() ); }

        async.parallel( [function( callback ){
          var oldMembers = null;
          if( typeof network.toJSON().members !== 'undefined' && typeof request.payload.network.members !== 'undefined' ) {
            oldMembers = _.reject(Object.keys(network.toJSON().members), function (member) {
              return _.contains(Object.keys(request.payload.network.members), member);
            });
          } else if (typeof network.toJSON().members !== 'undefined') {
            oldMembers = Object.keys( network.toJSON().members );
          }
          if( oldMembers ) {
            User.update({_id: {$in: oldMembers}}, {$pull: {networks: network.id}}, {multi: true},
              function (err) {
                if (err) { return reply(Boom.badRequest(err));  }

                callback();
              });
          } else {
            callback();
          }
        }, function( callback ){
          var newMembers = null;
          if( typeof request.payload.network.members !== 'undefined' && typeof network.toJSON().members !== 'undefined' ) {
            newMembers = _.reject(Object.keys(request.payload.network.members), function (member) {
              return _.contains(Object.keys(network.toJSON().members), member);
            });
          } else if (typeof request.payload.network.members !== 'undefined' ){
            newMembers = Object.keys( request.payload.network.members );
          }

          if( newMembers ) {
            User.update({_id: {$in: newMembers}}, {$push: {networks: network.id}}, {multi: true},
              function (err) {
                if (err) { return reply(Boom.badRequest(err)); }

                callback();
              });
          } else {
            callback();
          }
        }], function(){
          return reply( {network: network} );
        });
      });
    });
  }
}
function adminNetwork( request, reply ) {
  if( typeof request.params.id === 'undefined' ) { return reply( Boom.badRequest() ); }

  getNetwork( request, reply, function(network) {
    if( !network.isPrivate ) {
      User.update({_id: request.auth.credentials.id}, {$push: {pending: network.id}}, {multi: false}, function(err){
        if( err ) { return reply( Boom.badRequest(err)); }

        reply( {requested: true} );
      });
    } else {
      reply( Boom.badRequest() );
    }
  });
}
function joinNetwork( request, reply ) {
  if( typeof request.params.id === 'undefined' ) { return reply( Boom.badRequest() ); }

  getNetwork( request, reply, function(network) {
    if( !network.isPrivate && !network.isProtected ) {
      User.update({_id: request.auth.credentials.id}, {$push: {networks: network.id}}, {multi: false}, function(err){
        if( err ) { return reply( Boom.badRequest(err)); }

        reply( {joined: true} );
      });
    } else if( network.isProtected ) {
      User.update({_id: request.auth.credentials.id}, {$push: {pending: network.id}}, {multi: false}, function(err){
        if( err ) { return reply( Boom.badRequest(err)); }

        reply( {pending: true} );
      });
    } else {
      reply( Boom.badRequest() );
    }
  });
}
function addMediaNetwork( request, reply ) {
  if( typeof request.params.id === 'undefined' ) { return reply( Boom.badRequest() ); }
  if( !_.contains(request.auth.credentials.access, 'sudo') ) { return reply( Boom.badRequest() ); }

  Network.update({_id: request.params.id}, {$set: {cover: request.params.id}}, {multi: false}, function(err){
    if( err ) { return reply( Boom.badRequest(err)); }

    reply( {media: true} );
  });
}
function leaveNetwork( request, reply ) {
  if( typeof request.params.id === 'undefined' ) { return reply( Boom.badRequest() ); }

  User.update({_id: request.auth.credentials.id}, {$pull: {networks: request.params.id}}, {multi: false}, function(err){
    if( err ) { return reply( Boom.badRequest(err)); }

    reply( {left: true} );
  });
}
function removeNetwork( request, reply ){
  if( !_.contains(request.auth.credentials.access, 'sudo') ) {
    return reply( Boom.badRequest() );
  }
  if( typeof request.params.id !== 'undefined' ) {
    getNetwork( request, reply, function(network) {
      var oldMembers = null;
      if (typeof network.toJSON().members !== 'undefined') {
        oldMembers = Object.keys( network.toJSON().members );
      }
      Network.remove({_id: request.params.id}, function (err) {
        if (err) { return reply(Boom.badRequest()); }

        if( oldMembers ) {
          User.update({_id: {$in: oldMembers}}, {$pull: {networks: request.params.id}}, {multi: true},
            function (err) {
              if (err) { return reply(Boom.badRequest(err)); }

              reply({removed: true});
            });
          // TODO: Conversations.remove( {network: network._id}, function(){ ... });
        } else {
          reply({removed: true});
        }
      });
    });
  } else {
    return reply( Boom.badRequest() );
  }
}

module.exports = {
  create: createNetwork,
  read: getNetwork,
  update: updateNetwork,
  admin: adminNetwork,
  join: joinNetwork,
  leave: leaveNetwork,
  media: addMediaNetwork,
  remove: removeNetwork
};