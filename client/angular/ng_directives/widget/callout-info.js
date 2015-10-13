angular.module('baseApp.directives')
  .directive('calloutInfo', ['currentUser', function( currentUser ){
    'use strict';

    return {
      restrict: 'E',
      transclude: true,
      scope: {
        resource: '='
      },
      templateUrl: '/assets/html/ng_directives/widget/callout-info',
      link: function(scope, elem, attr){
        scope.currentUser = currentUser.get();
        scope.header = attr.header;
        scope.icon = attr.icon;
        console.log( scope.header, scope.resource );
      }
    };
  }]);