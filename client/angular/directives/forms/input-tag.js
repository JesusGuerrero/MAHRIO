angular.module('baseApp.directives')
  .directive('formInputTag', ['$rootScope',
    function( ){
      'use strict';
      return {
        restrict: 'E',
        replace: true,
        templateUrl: '/assets/html/directives/forms/input-tag.html',
        scope: {
          dataEntry: '=model',
          minLength: '=',
          required: '=',
          regex: '=',
          maxLength: '='
        },
        link: function( scope, elem, attr ) {
          scope.placeholder = attr.placeholder || '';
          scope.label = attr.label || false;
          scope.id = attr.id || new Date().getTime();
          scope.type = attr.type || 'text';
          scope.icon = attr.icon || '';

          scope.regx = typeof scope.regex !== 'undefined' ? scope.regex : { pattern: new RegExp('') };

          scope.hasError = function() {
            return scope.$parent.submitted && elem.hasClass( 'ng-invalid' );
          };
        }
      };
    }]);