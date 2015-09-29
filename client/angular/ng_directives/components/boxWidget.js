angular.module('baseApp.directives')
  .directive('boxWidget', ['$rootScope',
    function(){
      'use strict';
      return {
        restrict: 'A',
        link: function(){
          try {
            $.AdminLTE.boxWidget.activate();
          } catch(e) {
            console.error( 'AdminLTE not found!');
          }
        }
      };
    }
  ]);