angular.module('baseApp.directives')
  .directive('mailboxInbox', [ 'Mail',
    function( Mail ){
      'use strict';
      return {
        restrict: 'A',
        replace: true,
        templateUrl: '/assets/html/mail/directiveMailMessagesInbox',
        scope: {
          messages: '=',
          config: '='
        },
        link: function(scope) {
          scope.toggleStar = function ( index ){
            scope.messages[index].toStarred = !scope.messages[index].toStarred;
            Mail.setStarred( scope.messages[index], 'toStarred' )
              .then( function(){
                console.log('toStarred');
              });
          };
          scope.moveArchived = function ( index ){
            scope.messages[index].toArchived = true;
            Mail.setArchived( scope.messages[index], 'toArchived' )
              .then( function(){
                scope.messages.splice( index, 1 );
              });
          };
          scope.moveDeleted = function ( index ){
            scope.messages[index].toDeleted = true;
            Mail.setDeleted( scope.messages[index], 'toDeleted' )
              .then( function(){
                scope.messages.splice( index, 1 );
              });
          };
        }
      };
    }
  ])
  .directive('mailboxStarred', ['Mail', 'currentUser',
    function( Mail, currentUser ){
      'use strict';
      return {
        restrict: 'A',
        replace: true,
        templateUrl: '/assets/html/mail/directiveMailMessagesStarred',
        scope: {
          messages: '=',
          config: '='
        },
        link: function(scope) {
          scope.toggleStar = function ( index ){
            var field;
            if( scope.messages[index].fromUser._id === currentUser.get()._id ) {
              field = 'fromStarred';
              scope.messages[index].fromStarred = !scope.messages[index].fromStarred;
            } else {
              field = 'toStarred';
              scope.messages[index].toStarred = !scope.messages[index].toStarred;
            }
            Mail.setStarred( scope.messages[index], field )
              .then( function(){
                scope.messages.splice( index, 1 );
              });
          };
        }
      };
    }
  ])
  .directive('mailboxDrafts', [ 'Mail',
    function( Mail ){
      'use strict';
      return {
        restrict: 'A',
        replace: true,
        templateUrl: '/assets/html/mail/directiveMailMessagesDrafts',
        scope: {
          messages: '=',
          config: '='
        },
        link: function(scope) {
          scope.moveDeleted = function ( index ){
            scope.messages[index].fromDeleted = true;
            Mail.setDeleted( scope.messages[index], 'fromDeleted' )
              .then( function(){
                scope.messages.splice( index, 1 );
              });
          };
        }
      };
    }
  ])
  .directive('mailboxSent', ['Mail',
    function( Mail ){
      'use strict';
      return {
        restrict: 'A',
        replace: true,
        templateUrl: '/assets/html/mail/directiveMailMessagesSent',
        scope: {
          messages: '=',
          config: '='
        },
        link: function(scope) {
          scope.toggleStar = function ( index ){
            scope.messages[index].fromStarred = !scope.messages[index].fromStarred;
            Mail.setStarred( scope.messages[index], 'fromStarred' )
              .then( function(){
                //
              });
          };
          scope.moveArchived = function ( index ){
            scope.messages[index].fromArchived = true;
            Mail.setArchived( scope.messages[index], 'fromArchived' )
              .then( function(){
                scope.messages.splice( index, 1 );
              });
          };
          scope.moveDeleted = function ( index ){
            scope.messages[index].fromDeleted = true;
            Mail.setDeleted( scope.messages[index], 'fromDeleted' )
              .then( function(){
                scope.messages.splice( index, 1 );
              });
          };
        }
      };
    }
  ])
  .directive('mailboxArchived', ['Mail','currentUser',
  function( Mail, currentUser ){
    'use strict';
    return {
      restrict: 'A',
      replace: true,
      templateUrl: '/assets/html/mail/directiveMailMessagesArchived',
      scope: {
        messages: '=',
        config: '='
      },
      link: function(scope) {
        scope.toggleStar = function ( index ){
          var field;
          if( scope.messages[index].fromUser._id === currentUser.get()._id ) {
            field = 'fromStarred';
            scope.messages[index].fromStarred = !scope.messages[index].fromStarred;
          } else {
            field = 'toStarred';
            scope.messages[index].toStarred = !scope.messages[index].toStarred;
          }
          Mail.setStarred( scope.messages[index], field )
            .then( function(){
              console.log(field, ' complete!');
            });
        };
        scope.unArchived = function ( index ){
          var field;
          if( scope.messages[index].fromUser._id === currentUser.get()._id ) {
            field = 'fromArchived';
            scope.messages[index][field] = false;
          } else {
            field = 'toArchived';
            scope.messages[index][field] = false;
          }
          Mail.setArchived( scope.messages[index], field )
            .then( function(){
              scope.messages.splice( index, 1 );
            });
        };
        scope.addToSelected = function(index) {
          console.log( scope.messages[index] );
        };
      }
    };
  }]);