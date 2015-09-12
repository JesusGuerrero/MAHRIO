'use strict';

var async = require('async'),
    _ = require('underscore'),
    Boom = require('boom'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Membership = mongoose.model('Membership'),
    Conversation = mongoose.model('Conversation'),
    Message = mongoose.model('Message'),
    Media = mongoose.model('Media'),
    Profile = mongoose.model('Profile'),
    Notification = mongoose.model('Notification'),
    config;

function emitMessage( eventLabel ) {
  if( typeof config !== 'undefined') {
    var socket = config.getSocket();
    socket.emit( eventLabel );
    socket.broadcast.emit( eventLabel );
  }
}
function getConversations(request, reply) {
  Membership
    .find({_user: request.auth.credentials.id})
    .lean()
    .limit( 10 )
    .exec( function(err, memberships){
      var conversations = _.groupBy( memberships, '_conversation');
      async.forEach( Object.keys(conversations), function(conversationId, callback){
        Conversation
          .findOne( {_id: conversationId} )
          .lean()
          .select('messages members created')
          .populate([{
            path: 'members',
            select: 'email'
          },{
            path: 'messages',
            select: 'content _user created',
            options: {
              limit: 20,
              sort: {
                'created': -1
              }
            }
          }])
          .exec( function(err, cvr){
            cvr.members = _.groupBy( cvr.members, '_id');
            conversations[conversationId] = cvr;
            callback();
          });
      }, function(){
        conversations = _.sortBy( conversations, function(v){ return v.created*-1; });
        return reply( { currentUser: request.auth.credentials.id, conversations: conversations } );
      });
    });
}
function getOneConversation( id, reply ){
  Conversation
    .findOne( {_id : id })
    .populate('members')
    .lean()
    .exec( function(err, doc){
      if( !doc ){
        return reply( Boom.badRequest('conversation not found'));
      }

      doc.users = [];
      async.forEach( doc.members, function(item, callback){
        User.findOne( item._user, function(err, user){
          if( err ){ return reply(Boom.badImplementation()); }

          doc.users.push( {id: user.id, email: user.email, joined: item.created} );
          callback();
        });
      }, function(){
        delete doc.members;
        Message
          .find( {_conversation: id})
          .lean()
          .exec(function(err, msgs){
            _.each( msgs, function(item){ delete item._conversation; });
            doc.messages = msgs;

            return reply( doc );
          });
      });
    });
}

function postConversation(request, reply) {
  var startConversation;
  if( typeof request.payload.message === 'undefined' || request.payload.message === '' ) {
    return reply( Boom.badRequest('no message sent') );
  }

  // TODO CHECK OTHER USER IS VALID
  User.findById( request.params.userId, function(err){
    if( err ) { reply( Boom.badRequest('invalid message receiver') ); }

    Membership.find({
      _user: {
        $in:[request.params.userId, request.auth.credentials.id]
      }})
      .populate('_conversation')
      .exec( function(err, docs){
        var conversations = _.groupBy( docs, function(item){ return item._conversation._id; });
        var existingConversation = _.find( conversations, function(item){
          if( item[0]._conversation.members.length === 2 &&
            item[0]._conversation.members.indexOf(request.params.userId) !== -1 &&
            item[0]._conversation.members.indexOf( request.auth.credentials.id) !== -1 ) {
            return item;
          }
        });
        if( existingConversation ){
          var msg = new Message( {
            content: request.payload.message,
            _user: request.auth.credentials.id,
            _conversation: existingConversation[0]._conversation._id
          });

          msg.save( function(err, msg){
            Conversation.update({_id: existingConversation[0]._conversation._id},
              {$push: {messages: msg}},
              {upsert: false}, function(){
                return reply(msg);
              });
          });
        }else {
          startConversation = new Conversation();
          startConversation.save( function(err, conversation){
            var myMembership = new Membership({
              _user: request.auth.credentials.id,
              _conversation: conversation.id
            });
            var otherMembership = new Membership({
              _user: request.params.userId,
              _conversation: conversation.id
            });
            var msgId, msg = new Message( {
              content: request.payload.message,
              _user: request.auth.credentials.id,
              _conversation: conversation.id });

            async.forEach([myMembership, otherMembership, msg], function(entity, callback){
              entity.save( function(err, data){
                if( data.content ){
                  msgId = data.id;
                }
                callback();
              });
            }, function(){
              conversation.members.push(request.params.userId);
              conversation.members.push(request.auth.credentials.id);
              conversation.messages.push( msgId );

              conversation.save( function(){
                return reply({conversation: conversation});
              });
            });
          });
        }

      });
  });
}
function sendMessage(request, reply) {
  var msg = new Message( {
    content: request.payload.message,
    _user: request.auth.credentials.id,
    _conversation: request.params.conversationId });

  msg.save( function(err, message){
    Conversation.update({_id: request.params.conversationId}, {$push: {messages: msg}}, {upsert: false}, function(){
      return reply({ message: message} );
    });
  });
}

function getPrivateConversations( request, reply ) {
  Conversation
    .find({members: {$in: [request.auth.credentials.id]}})
    .populate([{
      path: 'members',
      select: 'email profile avatarImage'
    },{
      path: 'messages'
    }])
    .exec(function (err, conversations) {
      if (err) {
        return reply(Boom.badRequest(err));
      }

      if( typeof callback === 'function'){
        callback(conversations);
      } else {
        if( conversations === null ) {
          return reply({conversations: []});
        }
        async.forEach(conversations ,function(item,callback) {
          Media.populate( item.members,{ "path": "avatarImage" },function(err) {
            if (err) { return reply( Boom.badRequest(err)); }

            callback();
          });
        }, function() {
          async.forEach(conversations ,function(item,callback) {
            Profile.populate( item.members,{ "path": "profile" },function(err) {
              if (err) { return reply( Boom.badRequest(err)); }

              callback();
            });
          }, function() {
            conversations = _.map( conversations, function(item){
              var jsonItem = item.toJSON();
              jsonItem.members = _.indexBy( jsonItem.members, '_id');
              return jsonItem;
            });
            reply({conversations: conversations});
          });
        });
      }
    });
}
// request.query.userId
function getPrivateConversation( request, reply, callback ) {
  if( typeof callback === 'undefined' && !request.query.userId ) {
    return getPrivateConversations( request, reply );
  }

  Conversation
    .findOne({
      $or: [
        { members: [request.auth.credentials.id, request.query.userId]},
        { members: [request.query.userId,request.auth.credentials.id]}]
    })
    .populate([{
      path: 'members',
      select: 'email profile avatarImage'
    },{
      path: 'messages'
    }])
    .exec( function (err, conversation) {
      if (err) {
        return reply(Boom.badRequest(err));
      }

      if( typeof callback === 'function'){
        callback(conversation);
      } else {
        if( conversation === null ) {
          return reply({conversation: null});
        }
        async.forEach(conversation.members ,function(item,callback) {
          Media.populate( item,{ "path": "avatarImage" },function(err) {
            if (err) { return reply( Boom.badRequest(err)); }

            callback();
          });
        }, function() {
          async.forEach(conversation.members ,function(item,callback) {
            Profile.populate( item,{ "path": "profile" },function(err) {
              if (err) { return reply( Boom.badRequest(err)); }

              callback();
            });
          }, function() {
            conversation = conversation.toJSON();
            conversation.members = _.indexBy( conversation.members, '_id' );
            reply({conversation: conversation});
          });
        });
      }
    });
}
// request.query.userId && request.payload.conversation
function postPrivateConversation( request, reply ) {
  getPrivateConversation( request, reply, function( conversation ){
    if( conversation === null ) {
      Message.create( request.payload.conversation.message, function(err, msg){
        if( err ) { return reply(Boom.badRequest(err)); }
        delete request.payload.conversation.message;
        request.payload.conversation.messages = [msg.id];
        request.payload.conversation.members = [request.query.userId, request.auth.credentials.id];
        Conversation.create( request.payload.conversation, function(err, conv){
          if( err ) { return reply( Boom.badRequest(err)); }

          msg._conversation = conv.id;
          msg._user = request.auth.credentials.id;
          msg.save( function(err, msg){
            if( err ) { return reply( Boom.badRequest(err));}
            conv.messages = [msg];

            emitMessage( 'event:notification:'+request.query.userId );
            Notification.create({
              resource: 'chat',
              id: conv.id,
              heading: 'Private Conversation',
              teaser: msg.content,
              _user: request.query.userId
            }, function() {
              return getPrivateConversation( request, reply);
            });
          })
        })
      });
    } else {
      return reply( Boom.badRequest('Conversation Exists') );
    }
  });
}
//request.query.userId && request.payload.message
function sendPrivateMessage( request, reply ){
  getPrivateConversation( request, reply, function( conversation ){
    if( conversation === null ) {
      return reply( Boom.badRequest('Conversation not found!') );
    }
    request.payload.message._user = request.auth.credentials.id;
    request.payload.message._conversation = conversation.id;
    Message.create( request.payload.message, function(err, msg){
      if( err ) { return reply(Boom.badRequest(err)); }

      conversation.messages = _.map(conversation.messages, function(item){ return item.id;});
      conversation.messages.push( msg.id );
      conversation.save( function(){
        if( err ) { return reply(Boom.badRequest(err)); }

        emitMessage( 'event:notification:'+request.query.userId );
        Notification.create({
          resource: 'chat',
          id: conversation.id,
          heading: 'Private Conversation',
          teaser: msg.content,
          _user: request.query.userId
        }, function(err) {
          reply( {message: msg, err: err} );
        });
      });
    });
  })
}
function getPublicConversations( request, reply ){
  Conversation
    .find( {} )
    .and([{
      members: {$exists: false}
    }])
    .populate([{
      path: 'messages'
    }])
    .exec(function (err, conversations) {
      if (err) {
        return reply(Boom.badRequest(err));
      }
      reply({conversations: conversations});
    });
}
function getPublicConversation( request, reply ){
  if( !request.query.conversationId ) {
    return getPublicConversations( request, reply );
  }
  Conversation
    .find( {_id: request.query.conversationId } )
    .and([{
      members: {$exists: false}
    }])
    .populate([{
      path: 'messages'
    }])
    .exec(function (err, conversation) {
      if (err) {
        return reply(Boom.badRequest(err));
      }
      reply({conversations: conversation});
    });
}
// request.query.userId && request.payload.conversation
function postPublicConversation( request, reply ) {
  Message.create( request.payload.conversation.message, function(err, msg){
    if( err ) { return reply(Boom.badRequest(err)); }

    delete request.payload.conversation.message;
    request.payload.conversation.messages = [msg.id];
    delete request.payload.conversation.members;
    Conversation.create( request.payload.conversation, function(err, conv){
      if( err ) { return reply( Boom.badRequest(err)); }

      msg._conversation = conv.id;
      msg._user = request.auth.credentials.id;
      msg.save( function(err, msg){
        if( err ) { return reply( Boom.badRequest(err));}
        conv.messages = [msg];

        request.query = { conversationId: conv.id };
        return getPublicConversation( request, reply);
      })
    })
  });
}
function sendPublicMessage( request, reply ){

}
module.exports = {
  setConfig: function( cfg ) {
    config = cfg;
  },
  getConversations: getConversations,
  getOneConversation: getOneConversation,
  postConversation: postConversation,
  sendMessage: sendMessage,
  /* -------- */
  getPrivateConversations: getPrivateConversations,
  getPrivateConversation: getPrivateConversation,
  postPrivateConversation: postPrivateConversation,
  sendPrivateMessage: sendPrivateMessage,
  getPublicConversations: getPublicConversations,
  getPublicConversation: getPublicConversation,
  postPublicConversation: postPublicConversation,
  sendPublicMessage: sendPublicMessage
};