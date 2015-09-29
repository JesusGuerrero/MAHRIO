angular.module('baseApp.directives')
  .directive('notificationsBar', ['$rootScope',
    function($rootScope){
      'use strict';
      return {
        restrict: 'E',
        templateUrl: '/assets/html/ng_directives/components/notificationBar',
        link: function(scope){
          scope.messages = $rootScope.messages;
        }
      };
    }
  ]);