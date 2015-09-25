angular.module('baseApp.directives')
  .directive('mailboxTopMenu', [
    function( ){
      'use strict';
      return {
        restrict: 'A',
        replace: true,
        templateUrl: '/assets/html/mail/directiveTopMenu',
        scope: {
          config: '=',
          messages: '='
        },
        link: function(scope) {
          scope.removeMail = function() {
            window.alert('remocing');
            console.log( scope.messages );

          };
        }
      };
    }
  ]);