angular.module('baseApp.directives')
  .directive('mailboxTopMenu', ['$rootScope',
    function( ){
      'use strict';
      return {
        restrict: 'A',
        replace: true,
        templateUrl: '/assets/html/mail/directiveTopMenu',
        scope: {
          config: '='
        },
        link: function() {
        }
      };
    }
  ]);