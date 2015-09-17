angular.module('baseApp.directives')
  .directive('headerNavigationTop', ['$rootScope','currentUser','Socket','Notification','_','Chat',
    function( $rootScope, currentUser, Socket, Notification, _, Chat ){
      'use strict';
      return {
        restrict: 'A',
        replace: true,
        scope: {
          access: '='
        },
        link: function(scope) {
          scope.logout = $rootScope.logout;
          scope.current = currentUser.get();
          function populateMessageNotice(res, newUser ){
            scope.notifications = res.notifications;
            _.each( Object.keys( scope.notifications ), function( key ) {
              scope[ key ] = {
                total: Object.keys( scope.notifications[key] ).length
              };
            });
            Chat.getAllPrivateConversations()
              .then( function(res){
                var groupById = _.groupBy( res.conversations, function(conv){ return conv._id; });
                _.each( Object.keys( groupById ), function(key){ groupById[key] = groupById[key][0]; });
                var allConversations = {};
                _.each( Object.keys( groupById ), function( key ) {
                  delete groupById[key].members[newUser._id];
                  var users = [];
                  _.each( Object.keys( groupById[key].members ), function(k){
                    users.push( groupById[key].members[k] );
                  });
                  groupById[key].members = users;
                  groupById[key].messages.reverse();
                  if( scope.notifications && scope.notifications.chat  ) {
                    if( typeof scope.notifications.chat[key] === 'undefined' ) {
                      scope.notifications.chat[key] = groupById[key];
                      delete scope.notifications.chat[key].members[newUser._id ];
                      var users2 = [];
                      _.each( Object.keys( scope.notifications.chat[key].members ), function(k){
                        users.push( scope.notifications.chat[key].members[k] );
                      });
                      scope.notifications.chat[key].members = users2;
                      scope.notifications.chat[key].messages.reverse();
                    } else {
                      scope.notifications.chat[key].isNew = true;
                    }
                  } else {
                    allConversations[key] = groupById[key];
                  }
                });
                if( Object.keys( allConversations ).length ) {
                  scope.notifications = {
                    chat: allConversations
                  };
                }
                scope.notifications.chat = _.sortBy( scope.notifications.chat, function(entry){ return new Date(entry.messages[0].created).getTime()*-1; });
              });
          }
          scope.$watch( currentUser.get, function(newUser){
            if( typeof newUser === 'undefined' ) {
              newUser = {access: 'any'};
            } else {

              Socket.get.on('event:notification:'+newUser._id, function(){

                Notification.get()
                  .then( function(res){
                    populateMessageNotice(res, newUser);
                  });
              });
            }
            switch( newUser.access ){
              case 'any':
                scope.dynamicTemplateUrl = '/assets/html/layout/header/any';
                break;
              case 'admin':
                scope.dynamicTemplateUrl = '/assets/html/layout/header/authorized';
                scope.user = newUser;
                break;
              case 'authorized':
                scope.dynamicTemplateUrl = '/assets/html/layout/header/authorized';
                scope.user = newUser;
                scope.notifications = {};
                Notification.get()
                  .then( function(res){
                    populateMessageNotice(res, newUser);
                  });
                break;
              default:
            }
            scope.toggleSidebar = function(){
              $rootScope.toggleSidebarCollapsed();
            };
          });

        },
        template: '<ng-include src="dynamicTemplateUrl" render-app-gestures></ng-include>'
      };
    }
  ]);