angular.module('baseApp.directives')
  .directive('modalEditEvent', ['Calendar','$rootScope','$http','_','currentUser','$state',
    function( Calendar, $rootScope, $http, _, currentUser, $state ){
      'use strict';
      return {
        restrict: 'E',
        templateUrl: '/assets/html/calendar/modalEditEvent',
        replace: true,
        link: function(scope) {
          var eventId = null;
          function getData( id ) {
            if( typeof id !== 'undefined' ) {
              Calendar.get( id )
                .then( function(res) {
                  scope.event = res.event;
                  scope.event.invited = scope.event.invited || [];
                  scope.hasInvited = scope.event.invited ? Object.keys( scope.event.invited).length : false;
                });
            }
          }
          scope.$parent.save = function(){
            var event = _.extend( {}, scope.event );
            if( $('#eventStart').val() ) {
              event.start = new Date( $('#eventStart').val() + ' UTC').toISOString();
            }
            if( $('#eventEnd').val() ) {
              event.end = new Date( $('#eventEnd').val() + ' UTC').toISOString();
            }
            event.invited = Object.keys(_.indexBy(event.invited, '_id'));

            if( scope.event._id ) {
              Calendar.update( event )
                .then( function(){
                  $state.reload();
                });
            } else {
              Calendar.create( event )
                .then( function(){
                  scope.$parent.close();
                });
            }

          };
          scope.$parent.discard = function(){
            Calendar.remove( eventId )
              .then( function() {
                $rootScope.$broadcast('event:removeSuccess', eventId );
              });
          };
          scope.$watch( function() { return Calendar.currentEventId; }, function(newData){
            if( newData ) {
              scope.$parent.objectId = newData;
              eventId = newData;
              getData( eventId );
            }
            scope.event = {
              invited: []
            };
          });
          var usersCache = [];
          scope.selected = function($item) {
            var extracted = $item.match(/(.*?)&lt;(.*?)&gt;/),
              selection = _.find( usersCache, function(user){ return user.email === extracted[2]; });

            scope.event.invited.push({
              email: selection.email,
              _id: selection._id,
              profile: {
                firstName: selection.profile.firstName,
                lastName: selection.profile.lastName
              }
            });
            scope.hasInvited = scope.event.invited ? Object.keys( scope.event.invited).length : false;
            scope.$broadcast('clearInput');
          };
          scope.removeMember = function( id ) {
            delete scope.event.invited[ id ];
          };
          scope.getUsers = function(val) {
            return $http.get('/api/autocomplete/users', {
              params: {
                q: val
              }
            }).then(function(response){
              usersCache = response.data.users;
              var current = currentUser.get(),
                filteredUserList =  _
                  .filter( response.data.users, function(user){
                    return user.email !== current.email && !_.find(scope.event.invited, function(i){return i.email ===user.email;});
                  });
              return filteredUserList.map(function(user){
                return (user.profile.firstName ? user.profile.firstName : '') + ' ' + (user.profile.lastName ?user.profile.lastName:'') + ' &lt;'+user.email+'&gt;';
              });
            });
          };
        }
      };
    }
  ]);