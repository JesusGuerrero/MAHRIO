angular.module('baseApp.directives')
  .directive('modalCreateConversation', ['Chat','currentUser','$http','_','$state',
    function(Chat, currentUser, $http, _, $state){
      'use strict';
      return {
        restrict: 'E',
        templateUrl: '/assets/html/chat/form',
        scope: {
          private: '='
        },
        link: function(scope){
          scope.private = scope.private || false;
          scope.conversation = {
            members: [],
            message: {
              content: ''
            }
          };
          var usersCache = [];
          scope.selected = function($item) {
            var extracted = $item.match(/(.*?)&lt;(.*?)&gt;/),
              selection = _.find( usersCache, function(user){ return user.email === extracted[2]; });

            scope.conversation.members.push({
              name: selection.profile.firstName + ' ' + selection.profile.lastName,
              email: selection.email,
              _id: selection._id
            });
            scope.$broadcast('clearInput');
          };
          scope.removeMember = function( i ) {
            scope.conversation.members.splice( i, 1);
          };
          scope.getAutoCompleteUserEmails = function(val) {
            return $http.get('/api/autocomplete/users', {
              params: {
                q: val
              }
            }).then(function(response){
              usersCache = response.data.users;
              var current = currentUser.get(),
                filteredUserList =  _
                  .filter( response.data.users, function(user){
                    return user.email !== current.email && !_.find(scope.conversation.members, function(i){return i.email ===user.email;});
                  });
              return filteredUserList.map(function(user){
                return (user.profile.firstName ? user.profile.firstName : '') + ' ' + (user.profile.lastName ?user.profile.lastName:'') + '&lt;'+user.email+'&gt;';
              });
            });
          };
          scope.sendMessage = function(){
            switch( scope.private ) {
              case false:
                Chat.startPublicConversation( scope.conversation )
                  .then( function(){
                    $state.reload();
                  });
                break;
              default:
                Chat.startPrivateConversation( null, scope.conversation )
                  .then( function(){
                    $state.reload();
                  });
            }
          };
        }
      };
    }
  ]);