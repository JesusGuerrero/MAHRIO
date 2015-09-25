angular.module('baseApp.services')
  .factory('MailResource', [ '$resource', function($resource) {
    'use strict';
    return $resource('/api/mail/:action',
      { action: '@action' },
      {
        create: {
          method: 'POST'
        },
        read: {
          method: 'GET'
        },
        update: {
          method: 'PUT'
        },
        remove: {
          method: 'DELETE'
        }
      }
    );
  }])
  .factory('Mail', [ 'MailResource', function( MailResource ) {
    'use strict';

    return {
      getAllInbox: function(){
        return MailResource.read( {action: 'inbox'} ).$promise;
      },
      getMessage: function( id ) {
        return MailResource.read( {action: id} ).$promise;
      },
      getAllDrafts: function() {
        return MailResource.read( {action: 'drafts'} ).$promise;
      },
      getAllSent: function() {
        return MailResource.read( {action: 'sent'} ).$promise;
      },
      getAllStarred: function() {
        return MailResource.read( {action: 'starred'} ).$promise;
      },
      getAllArchived: function() {
        return MailResource.read( {action: 'archived'} ).$promise;
      },
      saveMessage: function(message) {
        message.fromDraft = true;
        return MailResource.create( {}, {mail: message} ).$promise;
      },
      sendMessage: function(message) {
        message.fromDraft = false;
        return MailResource.create( {}, {mail: message} ).$promise;
      },
      setStarred: function( message, field ) {
        var mail = { mail: {id: message._id}};
        mail.mail[field] = message[field];
        return MailResource.update( {action: 'starred'}, mail).$promise;
      },
      setArchived: function( message, field ) {
        var mail = { mail: {id: message._id}};
        mail.mail[field] = message[field];
        return MailResource.update( {action: 'archived'}, mail).$promise;
      },
      setDeleted: function( message, field ) {
        var mail = { mail: {id: message._id}};
        mail.mail[field] = message[field];
        return MailResource.update( {action: 'delete'}, mail).$promise;
      }
    };
  }]);
