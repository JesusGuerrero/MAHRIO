angular.module('baseApp.directives')
  .directive('toolTip', ['$rootScope',
    function(){
      'use strict';
      return {
        restrict: 'A',
        link: function(scope, elem){
          try {
            $(elem).tooltip();
          } catch(e) {
            console.error( 'AdminLTE not found!');
          }
        }
      };
    }
  ]);