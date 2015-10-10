angular.module('baseApp.services')
  .factory('NewsletterResource', [ '$resource', function($resource) {
    'use strict';
    return $resource('/api/contact/:action',
      { action: '@action' },
      {
        add: { method: 'POST'},
        read:   { method: 'GET' },
        remove: { method: 'DELETE' }
      });
  }])
  .factory('Newsletter', [ 'NewsletterResource', function( NewsletterResource ) {
    'use strict';
    return {
      add: function( entry ) { return NewsletterResource.add( {action: 'newsletter'}, entry).$promise; },
      get: function( ) { return NewsletterResource.read( ).$promise; },
      remove: function( id ){ return NewsletterResource.remove( { id: id } ).$promise; }
    };
  }]);
