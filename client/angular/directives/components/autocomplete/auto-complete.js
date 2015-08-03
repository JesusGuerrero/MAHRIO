angular.module('baseApp.directives')
  .directive('autoComplete', [ function(){
    'use strict';
    return {
      restrict: 'E',
      templateUrl: '/assets/html/directives/components/autocomplete/auto-complete-input.html',
      scope: {
        inputModel: '=',
        placeholder: '@',
        autoCompleteHttp: '=',
        selected: '=' || function(){}
      },
      link: function(scope){
        scope.$on('clearInput', function(){
          delete scope.inputModel;
        });
      }
    };
  }]);