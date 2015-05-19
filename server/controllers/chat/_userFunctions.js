'use strict';

var async = require('async'),
    _ = require('underscore'),
    Boom = require('boom'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Membership = mongoose.model('Membership'),
    Conversation = mongoose.model('Conversation'),
    Message = mongoose.model('Message');

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
                return reply({});
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
module.exports = {
  getConversations: getConversations,
  getOneConversation: getOneConversation,
  postConversation: postConversation,
  sendMessage: sendMessage
};