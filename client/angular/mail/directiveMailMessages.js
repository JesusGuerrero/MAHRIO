angular.module('baseApp.directives')
  .directive('mailboxInbox', ['$rootScope',
    function( ){
      'use strict';
      return {
        restrict: 'A',
        replace: true,
        templateUrl: '/assets/html/mail/directiveMailMessages',
        scope: {
          messages: '=',
          config: '='
        },
        link: function(scope) {
          scope.toggleStar = function ( index ){
            console.log(index);
          };
        }
      };
    }
  ]);