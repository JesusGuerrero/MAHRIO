var tmp = {};
angular.module('baseApp.directives')
  .directive('modalWindow', [
    function(){
      'use strict';
      return {
        restrict: 'E',
        transclude: true,
        replace: true,
        templateUrl: function(elem,attrs) {
          return attrs.templateUrl || '/assets/html/modal/defaultView';
        },
        scope: {
          actions: '='
        },
        link: function(scope, elem, attrs){
          tmp.scope = scope;
          tmp.elem = elem;
          scope.modalId = attrs.modalId;

          scope.save = function(){
            scope.actions.save( scope.message )
              .then( function(){
                $(elem).modal('hide');
              });
          };
          scope.send = function(){
            scope.actions.send( scope.message )
              .then( function(){
                $(elem).modal('hide');
              });
          };
        }
      };
    }
  ]);