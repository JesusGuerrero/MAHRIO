'use strict';

var _ = require('underscore'),
  Boom = require('boom'),
  mongoose = require('mongoose'),
  Mail = mongoose.model('Mail'),
  User = mongoose.model('User');
  //Attachment = mongoose.model('Attachment');

var mailSchema = {
  toUser: '',
  subject: '',
  content: '',
  fromDraft: false
};

function createMail( request, reply ) {
  function create() {
    var newMail = new Mail( _.extendOwn(mailSchema, request.payload.mail) );
    User.findOne({email: request.payload.mail.toUser}, function(err, user){
      if( err ) { return reply( Boom.badRequest(err)); }

      newMail.fromUser = request.auth.credentials.id;
      newMail.toUser = user.id;
      newMail.save( function(err) {
        if( err ) { return reply( Boom.badRequest(err) ); }

        return reply();
      });
    });
  }
  if( request.payload.mail._id ) {
    Mail
      .findOne({_id: request.payload.mail._id, fromDraft: true, fromUser: request.auth.credentials.id})
      .select('toUser subject content fromDraft')
      .exec( function(err, mail){
        if( err ) { return reply( Boom.badRequest(err) ); }

        if( mail ) {
          mail = _.extendOwn( mail, request.payload.mail );
          User.findOne({email: request.payload.mail.toUser}, function(err, user){
            if( err ) { return reply( Boom.badRequest(err)); }

            mail.toUser = user.id;
            mail.save( function(err){
              if( err ) { return reply( Boom.badRequest(err)); }

              return reply();
            });
          });

        } else {
          create();
        }
      });
  } else {
    create();
  }
}

function readMail( request, reply ) {
  var query = Mail.find({}), readOne = false;
  switch( request.params.folder ) {
    case 'inbox':
      query
        .where('toUser', request.auth.credentials.id)
        .where('fromDraft', false)
        .where('toDeleted', false)
        .where('toArchived', false);
      break;
    case 'starred':
      console.log('in here');
      query
        .and([
          {
            fromDraft: false
          },
          {
            $or: [
              {
                $and: [
                  {toUser: request.auth.credentials.id},
                  {toDeleted: false},
                  {toStarred: true}
                ]
              },
              {
                $and: [
                  {fromUser: request.auth.credentials.id},
                  {fromDeleted: false},
                  {fromStarred: true}
                ]
              }
            ]
          }
        ]);
      break;
    case 'drafts':
      query
        .where('fromDraft', true)
        .where('fromUser', request.auth.credentials.id)
        .where('fromDeleted', false);
      break;
    case 'sent':
      query
        .where('fromDraft', false)
        .where('fromUser', request.auth.credentials.id)
        .where('fromDeleted', false)
        .where('fromArchived', false);
      break;
    case 'archived':
      query
        .and([
          {
            fromDraft: false
          },
          {
            $or: [
              {
                $and: [
                  {toUser: request.auth.credentials.id},
                  {toDeleted: false},
                  {toArchived: true}
                ]
              },
              {
                $and: [
                  {fromUser: request.auth.credentials.id},
                  {fromDeleted: false},
                  {fromArchived: true}
                ]
              }
            ]
          }
        ]);
      break;
    default:
      readOne = true;
      query.where({_id: request.params.folder});
      break;
  }

  query
    .populate([{
      path: 'toUser',
      select: 'email firstName lastName'
    },
    {
      path: 'fromUser',
      select: 'email firstName lastName'
    }])
    .exec( function(err, messages) {
      if( err ) { return reply( Boom.badRequest() ); }

      if( readOne && messages[0].toUser.id === request.auth.credentials.id ) {
        messages[0].toRead = true;
        messages[0].save( function(err){
          if( err ) { return reply( Boom.badRequest() ); }
          reply( {messages: messages} );
        });
      }
      reply( {messages: messages} );
    });
}

function updateMail( request, reply ) {
  function processFrom( mail ){
    if( request.params.folder === 'starred' ) {
      mail.fromStarred = request.payload.mail.fromStarred;
    } else if ( request.params.folder === 'archived' ) {
      mail.fromArchived = request.payload.mail.fromArchived;
    } else if ( request.params.folder === 'delete' ) {
      mail.fromDeleted = request.payload.mail.fromDeleted;
    }
    mail.save( function(err){
      if( err ) { return reply( Boom.badRequest('mail not updated') ); }
      return reply({updated: true});
    });
  }
  function processTo( mail ) {
    if( request.params.folder === 'starred' ) {
      mail.toStarred = request.payload.mail.toStarred;
    } else if ( request.params.folder === 'archived' ) {
      mail.toArchived = request.payload.mail.toArchived;
    } else if ( request.params.folder === 'delete' ) {
      mail.toDeleted = request.payload.mail.toDeleted;
    }
    mail.save( function(err){
      if( err ) { return reply( Boom.badRequest('mail not updated') ); }
      return reply({updated: true});
    });
  }
  Mail
    .findOne( {_id: request.payload.mail.id})
    .populate('fromUser toUser')
    .exec( function(err, mail){
      if( err ) { return reply( Boom.badRequest('mail item not found') ); }

      if( mail.fromUser.id === request.auth.credentials.id ) {
        processFrom( mail );
      } else if ( mail.toUser.id === request.auth.credentials.id ) {
        processTo( mail );
      } else {
        return reply( Boom.forbidden() );
      }
    });
}

module.exports = {
  createMail: createMail,
  readMail: readMail,
  updateMail: updateMail
};