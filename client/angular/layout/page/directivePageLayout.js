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
          var eventListener = false;
          scope.$watch( function(){ return Notification.confirm; }, function(newMsg){
            if( newMsg ) {
              scope.title = 'Confirm';
              scope.message = newMsg;
              $('#pageNotification').modal().show();
              if( !eventListener ) {
                $('#pageNotification').on('hide.bs.modal', function(){
                    Notification.confirm = null;
                });
                eventListener = true;
              }
            }
          });
          scope.close = function(){
            Notification.confirm = null;
          };
          scope.confirm = function(){
            Notification.confirmed = true;
              $('#pageNotification').modal('hide');
          };

        }
      };
    }
  ]);