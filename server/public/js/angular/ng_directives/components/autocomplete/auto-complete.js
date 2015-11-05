angular.module('baseApp.directives')
  .directive('autoComplete', [ function(){
    'use strict';
    return {
      restrict: 'E',
      templateUrl: '/assets/html/ng_directives/components/autocomplete/auto-complete-input.html',
      scope: {
        inputModel: '=',
        placeholder: '@',
        autoCompleteHttp: '=',
        hash: '@',
        single: '@',
        selected: '=' || function(){}
      },
      link: function(scope){
        scope.$on('clearInput', function(){
          delete scope.inputModel;
        });
      }
    };
  }]);