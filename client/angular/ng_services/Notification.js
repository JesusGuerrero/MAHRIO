angular.module('baseApp.services')
  .factory('NotificationResource', [ '$resource', function($resource) {
    'use strict';
    return $resource('/api/notifications/:resource',
      { resource: '@resource' },
      {
        read:   { method: 'GET' },
        add: { method: 'POST' },
        remove: { method: 'DELETE' }
      });
  }])
  .factory('Notification', [ 'NotificationResource', '$q', function( NotificationResource, $q ) {
    'use strict';
    var confirmMessage = null, confirmed = null, id = null, deferred = null;
    return {
      get: function( ) {
        if (deferred) {
          return deferred;
        } else {
          deferred = $q.defer();

          NotificationResource.read({}, function(res){
            deferred.resolve( res );
            deferred = null;
          }, function(){
            deferred.reject( );
            deferred = null;
          });

          return deferred.promise;
        }
      },
      addChat: function( id ) { return NotificationResource.add( {id: id, resource: 'chat'}).$promise; },
      remove: function( id ){ return NotificationResource.remove( { id: id, resource: 'chat' } ).$promise; },
      confirm: confirmMessage,
      confirmed: confirmed,
      id: id
    };
  }]);
