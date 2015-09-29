angular.module('baseApp.directives')
  .directive('conversations', ['$rootScope',
    function(){
      'use strict';
      return {
        restrict: 'E',
        scope: {
          conversations: '=',
          current: '=',
          load: '='
        },
        templateUrl: '/assets/html/chat/conversations',
        link: function(){
        }
      };
    }
  ]);