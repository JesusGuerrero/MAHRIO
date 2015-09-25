angular.module('baseApp.directives')
  .directive('wysihtml5', ['$rootScope',
    function( ){
      'use strict';
      return {
        restrict: 'A',
        scope: {
        },
        link: function( scope, elem) {
          $(elem).wysihtml5();
        }
      };
    }
  ]);