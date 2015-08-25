// jshint maxstatements:60
angular.module('baseApp.controllers')
  .controller('MailboxController', ['$scope','$state', 'Mail','SubHeader',
    function($scope, $state, Mail, SubHeader){
      'use strict';
      /*jshint maxcomplexity:10 */
      $scope.config = {};
      $scope.viewFolder = null;
      function setupPagination() {
        $scope.config.pagination = {
          total: $scope.messages.length,
          start: 1,
          end: $scope.messages.length > 10 ? 10 : $scope.messages.length
        };
      }
      function setHeader( name ){
        SubHeader.set.title = 'Mail';
        SubHeader.set.breadcrumbs = [
          {
            url: 'adminDash',
            value: 'Home'
          },
          {
            url: 'mail',
            value: 'Mail'
          },
          {
            url: 'adminDash',
            value: name
          }
        ];
      }
      $scope.mailProperties = {};
      $scope.messagesProperties = {};
      $scope.messages = [];
      if( $state.includes('mail.drafts') ) {
        $scope.viewFolder = 'drafts';
        $scope.config.title = 'Draft Messages';
        Mail.getAllDrafts()
          .then( function(draftMessages){
            $scope.messages = draftMessages.messages;
            $scope.mailProperties = {
              inboxCount: 1,
              draftCount: 2
            };
            setupPagination();
          });
        setHeader( 'Drafts' );
        SubHeader.set.subTitle = 'Draft Messages';
      } else if( $state.includes('mail.sent') ) {
        $scope.viewFolder = 'sent';
        $scope.config.title = 'Sent Messages';
        Mail.getAllSent()
          .then( function(sentMessages){
            $scope.messages = sentMessages.messages;
            $scope.mailProperties = {
              inboxCount: 1,
              draftCount: 2
            };
            setupPagination();
          });
        setHeader( 'Sent' );
        SubHeader.set.subTitle = 'Sent Messages';
      } else if( $state.includes('mail.starred') ) {
        $scope.viewFolder = 'starred';
        $scope.config.title = 'Starred Messages';
        Mail.getAllStarred()
          .then( function(starredMessages){
            $scope.messages = starredMessages.messages;
            $scope.mailProperties = {
              inboxCount: 1,
              draftCount: 2
            };
            setupPagination();
          });
        setHeader( 'Starred' );
        SubHeader.set.subTitle = 'Starred Messages';
      } else if( $state.includes('mail.archived') ) {
        $scope.viewFolder = 'archived';
        $scope.config.title = 'Archived Messages';
        Mail.getAllArchived()
          .then( function(archivedMessages){
            $scope.messages = archivedMessages.messages;
            $scope.mailProperties = {
              inboxCount: 1,
              draftCount: 2
            };
            setupPagination();
          });
        setHeader( 'Archived' );
        SubHeader.set.subTitle = 'Archived Messages';
      } else if( $state.includes('mail.view') ) {
        $scope.viewFolder = $state.params.action || 'view';
        $scope.config.title = 'Read Mail';
        Mail.getMessage($state.params.id)
          .then( function(message){
            $scope.message = message.messages[0];
            $scope.mailProperties = {
              inboxCount: 1,
              draftCount: 2
            };
            setupPagination();
          });
        setHeader( 'Read Mail' );
        SubHeader.set.subTitle = 'Archived Messages';
      } else if( $state.includes('mail') ) {
        $scope.viewFolder = 'inbox';
        $scope.config.title = 'Inbox Messages';
        Mail.getAllInbox()
          .then( function(inboxMessages){
            $scope.messages = inboxMessages.messages;
            $scope.mailProperties = {
              inboxCount: 1,
              draftCount: 2
            };
            setupPagination();
          });
        setHeader( 'Inbox' );
        SubHeader.set.subTitle = 'Inbox Messages';
      }

      $scope.actions = {
        save: function( message ){
          message.content = $('#wysihtml5-content').val();
          return Mail.saveMessage( message );
        },
        send: function( message ){
          message.content = $('#wysihtml5-content').val();
          return Mail.sendMessage( message );
        }

      };
    }
  ]
);