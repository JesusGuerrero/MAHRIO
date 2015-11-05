angular.module('baseApp.services').factory('ArticleResource', [ '$resource', function($resource) {
  'use strict';
  return $resource('/api/articles/:id',
    { id: '@id' },
    {
      create: { method: 'POST' },
      read:   { method: 'GET' },
      update: { method: 'PUT' },
      remove: { method: 'DELETE' }
    });
}]);
angular.module('baseApp.services').factory('Article', [ 'ArticleResource', function( ArticleResource ) {
  'use strict';
  return {
    add: function( article ) { return ArticleResource.create( {article: article} ).$promise; },
    addCoverImage: function( article, media ){
      return ArticleResource.update(
        {
          id: article._id
        },{
          article: {
            mediaInsert: media
          }
        }).$promise;
    },
    get: function( id, networkId ) {
      var options = id ? {id: id} : {};
      if( networkId ) {
        options.networkId = networkId;
      }
      return ArticleResource.read( options ).$promise;
    },
    update: function( article ) { return ArticleResource.update( {id: article._id}, {article: article} ) .$promise; },
    remove: function(id){ return ArticleResource.remove( {id: id} ).$promise; }
  };
}]);