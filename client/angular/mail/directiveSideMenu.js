angular.module('baseApp.directives')
  .directive('mailboxSideMenu', ['$rootScope',
    function( ){
      'use strict';
      return {
        restrict: 'A',
        replace: true,
        templateUrl: '/assets/html/mail/directiveSideMenu',
        scope: {
          properties: '=',
          modalId: '@'
        },
        link: function(scope, elem, attrs) {
          scope.composeMessage = function(){
            scope.$parent.$broadcast('event:composeMessage');
            $('#'+scope.modalId).modal().toggle();
          };
        }
      };
    }
  ]);