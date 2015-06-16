angular.module('baseApp.directives')
  .directive('modalComposeMessage', ['$rootScope',
    function( ){
      'use strict';
      return {
        restrict: 'E',
        templateUrl: '/assets/html/mail/modalComposeMessage',
        replace: true,
        link: function(scope) {
          scope.$on('event:composeMessage', function(){
            scope.message = {
              to: '',
              subject: '',
              content: ''
            };
            scope.$parent.dataObject = scope.message;
            $('#wysihtml5-content').data('wysihtml5').editor.clear();
          });

          $('#modalComposeMessage').on('hidden.bs.modal', function () {
            console.log('i closed');
          });
        }
      };
    }
  ]);