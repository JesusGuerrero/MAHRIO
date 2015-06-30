angular.module('baseApp.directives')
  .directive('modalComposeMessage', ['$http','_','currentUser',
    function( $http, _, currentUser ){
      'use strict';
      return {
        restrict: 'E',
        templateUrl: '/assets/html/mail/modalComposeMessage',
        replace: true,
        scope: {
          message: '=',
          actions: '='
        },
        link: function(scope) {
          scope.$on('event:composeMessage', function(){
            scope.mail = {
              toUser: '',
              subject: '',
              content: ''
            };
            scope.$parent.$parent.dataObject = scope.mail;
            $('#wysihtml5-content').data('wysihtml5').editor.clear();
          });

          scope.$watch( 'message', function(msg) {
            if( msg ) {
              scope.mail = msg;
              scope.mail.toUser = msg.toUser.email;
              scope.send = scope.actions.send;
              scope.save = scope.actions.save;
            }
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
              var filteredUserList =  _
                .filter( response.data.users, function(user){
                  return user.email !== currentUser.get().email;
                });
              return filteredUserList.map(function(user){
                return user.email;
              });
            });
          };
        }
      };
    }
  ]);