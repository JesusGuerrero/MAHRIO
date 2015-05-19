var sex2;
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
          sex2 = scope;

          scope.toggleStar = function ( index ){
            console.log(index);
          };
        }
      };
    }
  ]);