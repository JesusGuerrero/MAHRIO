angular.module('baseApp.directives')
  .directive('modalUserForm', [ function(){
    'use strict';

    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/assets/html/user/form',
      link: function(){

      }
    };
  }]);