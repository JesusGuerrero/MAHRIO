angular.module('baseApp.services').factory('SessionResource', [ '$resource', function($resource) {
  'use strict';
  return $resource('/api/session/:action',
    { action: '@action' },
    {
      proceed: { method: 'POST' }
    });
}]);
angular.module('baseApp.services').factory('Session', [ 'SessionResource', '$q', function( SessionResource, $q ) {
  'use strict';
  return {
    login: function(obj){
      var defer = $q.defer();
      SessionResource.proceed( {action: 'login'}, obj, function(user, headers){
        defer.resolve( { user: user, headers: headers } );
      }, function(err){
        defer.reject(err);
      });
      return defer.promise;
    },
    recoverPassword: function(obj){
      return SessionResource.proceed( {action: 'recover-password'}, obj).$promise;
    },
    hasValidToken: function(obj){
      return SessionResource.proceed( {action: 'is-valid-token'}, obj).$promise;
    },
    passwordReset: function(obj){
      var defer = $q.defer();
      SessionResource.proceed( {action: 'password-reset'}, obj, function(user, headers){
        defer.resolve( { user: user, headers: headers } );
      }, function(err){
        defer.reject(err);
      });

      return defer.promise;
    },
    logout: function(){
      return SessionResource.proceed( {action: 'logout'}).$promise;
    }
  };
}]);