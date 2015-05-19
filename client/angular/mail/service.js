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
  .factory('Mail', [ 'MailResource', '$q', '_', function( MailResource, $q, _) {
    'use strict';
    function aPromiseAndDelayedResolve( resolveData, param ) {
      var defer = $q.defer();
      if( typeof resolveData === 'function' ){
        setTimeout( function(){ var res = resolveData( param ); defer.resolve( res );}, 50);
      } else {
        setTimeout( function(){ defer.resolve( resolveData );}, 50);
      }
      return defer.promise;
    }
    var inboxMessages = [
      {
        read: 0,
        starred: 0,
        from: 'support@whichdegree.co',
        subject: 'Message Subject is Placed Here',
        time: new Date(),
        content: 'Hello John, <br/><br/>Paragraph 1<br/><br/>Paragraph 2<br/><br/>Paragraph 3<br/><br/>Paragraph 4',
        attachments: [
          {
            type: 'document',
            filename: 'sep2014-report.pdf',
            icon: 'pdf',
            size: 1245
          },
          {
            type: 'document',
            filename: 'App Description.docx',
            icon: 'word',
            size: 1245
          },
          {
            type: 'photo',
            filename: 'photo1.png',
            icon: 'https://almsaeedstudio.com/themes/AdminLTE/dist/img/photo1.png',
            size: 2670000
          }
        ]
      },
      {
        read: 1,
        starred: 0,
        from: 'John Doe',
        subject: 'Urgent! Please Read',
        content: 'Hello world!',
        attachments: [],
        time: new Date()
      },
      {
        read: 0,
        starred: 1,
        from: 'Jesus Rocha',
        subject: 'AdminLTE 2.0 Issue - Trying to find a solution to this problem...',
        content: 'Hello world!',
        attachments: [],
        time: new Date()
      },
      {
        read: 0,
        starred: 1,
        from: 'John Doe',
        time: new Date(),
        subject: 'Sucka! This Starred',
        content: 'This is it so far',
        attachments: []
      }
    ];
    var draftMessages = [
      {
        to: 'rjezuz@gmail.com',
        time: new Date(),
        subject: 'Yeah Sucka!',
        content: 'This is it so far',
        attachments: []
      }
    ];
    var sentMessages = [
      {
        to: 'rjezuz@gmail.com',
        time: new Date(),
        subject: 'Sucka! This Sent',
        content: 'This is it so far',
        attachments: []
      }
    ];
    var archivedMessages = [
      {
        from: 'rjezuz@gmail.com',
        time: new Date(),
        subject: 'Sucka! This Archived',
        content: 'This is it so far',
        attachments: []
      }
    ];
    return {
      getAllInbox: function(){
        return aPromiseAndDelayedResolve( inboxMessages );
        //return MailResource.read( {action: 'inbox'}).$promise;
      },
      getMessage: function( i ) {
        return aPromiseAndDelayedResolve( inboxMessages[i] );
      },
      getAllDrafts: function(){
        return aPromiseAndDelayedResolve( draftMessages );
        //return MailResource.read( {action: 'drafts'}).$promise;
      },
      getAllSent: function(){
        return aPromiseAndDelayedResolve( sentMessages );
        //return MailResource.read( {action: 'drafts'}).$promise;
      },
      getAllStarred: function(){
        var starredMessages = _(inboxMessages)
          .filter( function(msg){ return msg.starred; });
        return aPromiseAndDelayedResolve( starredMessages );
        //return MailResource.read( {action: 'drafts'}).$promise;
      },
      getAllArchived: function(){

        return aPromiseAndDelayedResolve( archivedMessages );
        //return MailResource.read( {action: 'drafts'}).$promise;
      },
      saveMessage: function(message){
        return aPromiseAndDelayedResolve( function(message){
          message.time = new Date();
          draftMessages.push( message );
          return  true;
        }, message);
      },
      sendMessage: function(message){
        return aPromiseAndDelayedResolve( function(message){
          message.time = new Date();
          sentMessages.push( message );
          return  true;
        }, message);
      }
    };
  }]);
