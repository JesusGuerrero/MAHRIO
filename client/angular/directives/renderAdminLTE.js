angular.module('baseApp.directives')
  .directive('renderAppGestures', ['$rootScope',
    function(){
      'use strict';
      return {
        restrict: 'A',
        link: function(){
          $.executeTheme();
        }
      };
    }
  ]);