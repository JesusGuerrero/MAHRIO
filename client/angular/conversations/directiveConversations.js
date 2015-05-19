angular.module('baseApp.directives')
  .directive('componentConversations', ['$rootScope',
    function(){
      'use strict';
      return {
        restrict: 'E',
        templateUrl: '/assets/html/conversations/componentConversations',
        link: function(){
        }
      };
    }
  ]);