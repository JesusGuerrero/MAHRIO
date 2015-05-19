angular.module('baseApp.directives')
  .directive('mailboxMessage', ['$rootScope',
    function( ){
      'use strict';
      return {
        restrict: 'A',
        replace: true,
        templateUrl: '/assets/html/mail/directiveMessage',
        scope: {
          messages: '=',
          config: '='
        },
        link: function() {

        }
      };
    }
  ]);