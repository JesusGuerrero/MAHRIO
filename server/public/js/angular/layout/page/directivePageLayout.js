angular.module('baseApp.directives')
  .directive('pageLayout', [ 'Notification',
    function( Notification ){
      'use strict';
      return {
        restrict: 'A',
        replace: true,
        transclude: true,
        templateUrl: '/assets/html/layout/page/index',
        link: function(scope) {
          scope.$watch( function(){ return Notification.confirm; }, function(newMsg){
            if( newMsg ) {
              scope.title = 'Confirm';
              scope.message = newMsg;
              $('#pageNotification').modal().show();
            }
          });
          scope.close = function(){
            Notification.confirm = null;
          };
          scope.confirm = function(){
            $('#pageNotification').modal().hide();
            Notification.confirm = null;
            Notification.confirmed = true;
          };
        }
      };
    }
  ]);