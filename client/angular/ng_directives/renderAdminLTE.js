angular.module('baseApp.directives')
  .directive('renderAppGestures', ['$rootScope',
    function(){
      'use strict';
      return {
        restrict: 'A',
        link: function(){
          $.executeTheme();
          $('.control-sidebar-tabs a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
          });
        }
      };
    }
  ]);