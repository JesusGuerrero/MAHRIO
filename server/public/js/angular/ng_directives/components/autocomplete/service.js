angular.module('baseApp.services').factory('Autocomplete',
  [ '$resource', function($resource) {
    'use strict';
    var $api = $resource('/api/autocomplete/:action', { action: '@action' });

    return {
      get: function( query ) {
        return $api.get( {action: query}).$promise;
      }
    };
}]);