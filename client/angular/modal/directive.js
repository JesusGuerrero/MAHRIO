var tmp = {};
angular.module('baseApp.directives')
  .directive('modalWindowView', [
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
          scope.type = attrs.type;
          scope.title = attrs.title;

          scope.save = function(){
            scope.actions.save( scope.dataObject )
              .then( function(){
                $(elem).modal('hide');
              });
          };
          scope.send = function(){
            scope.actions.send( scope.dataObject )
              .then( function(){
                $(elem).modal('hide');
              });
          };
          scope.discard = function( ){
            scope.actions.discard( scope.dataObject )
              .then( function(){
                scope.$parent.$broadcast('event:removeSuccess', scope.dataObject._id );
              });
          };
        }
      };
    }
  ]);