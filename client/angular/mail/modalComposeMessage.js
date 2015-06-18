angular.module('baseApp.directives')
  .directive('modalComposeMessage', ['$http',
    function( $http ){
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

          scope.getAutoCompleteUserEmails = function(val) {
            return $http.get('/api/autocomplete/users', {
              params: {
                q: val
              }
            }).then(function(response){
              return response.data.users.map(function(user){
                return user.email;
              });
            });
          };
        }
      };
    }
  ]);