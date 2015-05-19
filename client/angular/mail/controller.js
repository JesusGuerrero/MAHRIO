// jshint maxstatements:40
angular.module('baseApp.controllers')
  .controller('MailboxController', ['$scope','$state', 'Mail','SubHeader',
    function($scope, $state, Mail, SubHeader){
      'use strict';

      $scope.config = {};
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
      if( $state.includes('mail.drafts') ) {
        $scope.config.title = 'Draft Messages';
        Mail.getAllDrafts()
          .then( function(draftMessages){
            $scope.messages = draftMessages;
            $scope.mailProperties = {
              inboxCount: 1,
              draftCount: 2
            };
            setupPagination();
          });
        setHeader( 'Drafts' );
        SubHeader.set.subTitle = 'Draft Messages';
      } else if( $state.includes('mail.sent') ) {
        $scope.config.title = 'Sent Messages';
        Mail.getAllSent()
          .then( function(sentMessages){
            $scope.messages = sentMessages;
            $scope.mailProperties = {
              inboxCount: 1,
              draftCount: 2
            };
            setupPagination();
          });
        setHeader( 'Sent' );
        SubHeader.set.subTitle = 'Sent Messages';
      } else if( $state.includes('mail.starred') ) {
        $scope.config.title = 'Starred Messages';
        Mail.getAllStarred()
          .then( function(starredMessages){
            $scope.messages = starredMessages;
            $scope.mailProperties = {
              inboxCount: 1,
              draftCount: 2
            };
            setupPagination();
          });
        setHeader( 'Starred' );
        SubHeader.set.subTitle = 'Starred Messages';
      } else if( $state.includes('mail.archived') ) {
        $scope.config.title = 'Archived Messages';
        Mail.getAllArchived()
          .then( function(archivedMessages){
            $scope.messages = archivedMessages;
            $scope.mailProperties = {
              inboxCount: 1,
              draftCount: 2
            };
            setupPagination();
          });
        setHeader( 'Archived' );
        SubHeader.set.subTitle = 'Archived Messages';
      } else if( $state.includes('mail.view') ) {
        $scope.config.title = 'Read Mail';
        Mail.getMessage(0)
          .then( function(message){
            $scope.message = message;
            $scope.mailProperties = {
              inboxCount: 1,
              draftCount: 2
            };
            setupPagination();
          });
        setHeader( 'Read Mail' );
        SubHeader.set.subTitle = 'Archived Messages';
      } else if( $state.includes('mail') ) {
        $scope.config.title = 'Inbox Messages';
        Mail.getAllInbox()
          .then( function(inboxMessages){
            $scope.messages = inboxMessages;
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
          return Mail.saveMessage( message );
        },
        send: function( message ){
          return Mail.sendMessage( message );
        }

      };
    }
  ]
);