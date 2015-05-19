angular.module('baseApp.directives')
  .directive('componentLastConversation', ['$rootScope',
    function(){
      'use strict';
      return {
        restrict: 'E',
        templateUrl: '/assets/html/conversations/componentLastConversation',
        link: function(scope){
          //console.log( scope, elem, attr );
          scope.leftMessage = 'leftMessage';
          scope.rightMessage = 'rightMessage';
        }
      };
    }
  ]);