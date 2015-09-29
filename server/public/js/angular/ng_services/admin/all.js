angular.module('baseApp.services')
  .factory('AdminResource', [ '$resource', function($resource) {
    'use strict';
    return $resource('/admin/:action/:id',
      { action: '@action' },
      {
        get: {
          method: 'GET'
        },
        post: {
          method: 'POST'
        },
        delete: {
          method: 'DELETE'
        }
      }
    );
  }])
  .factory('Admin', [ 'AdminResource', function( AdminResource ) {
    'use strict';
    return {
      getNewsletterList: function(){
        return AdminResource.get({action:'newsletter'}).$promise;
      },
      deleteNewsletterEntry: function(id){
        return AdminResource.delete({action:'newsletter', id: id}).$promise;
      },
      getQuestionList: function(){
        return AdminResource.get( {action: 'questions'}).$promise;
      },
      deleteQuestionEntry: function(id){
        return AdminResource.delete({action:'questions', id: id}).$promise;
      },
      getUsersList: function(){
        return AdminResource.get( {action: 'users'}).$promise;
      },
      deleteUserEntry: function(id){
        return AdminResource.delete({action:'users', id: id}).$promise;
      },
      makeAdmin: function(email){
        return AdminResource.post( {action: 'user', id: 'profile'}, {email: email, access: 'admin'}).$promise;
      },
      getSessionToCMS: function(){
        return AdminResource.get( {action: 'cms', id: 'session'}).$promise;
      }
    };
  }]);