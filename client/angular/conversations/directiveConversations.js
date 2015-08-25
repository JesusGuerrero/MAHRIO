angular.module('baseApp.directives')
  .directive('conversations', ['$rootScope',
    function(){
      'use strict';
      return {
        restrict: 'E',
        scope: {
          conversations: '=',
          load: '='
        },
        templateUrl: '/assets/html/conversations/conversations',
        link: function(){
        }
      };
    }
  ]);