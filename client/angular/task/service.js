angular.module('baseApp.services')
  .factory('TaskResource', [ '$resource', function($resource) {
    'use strict';
    return $resource('/api/tasks/:action/:id/',
      { id: '@id', action: '@action' },
      {
        create: {
          method: 'POST'
        },
        read: {
          method: 'GET'
        },
        update: {
          method: 'PUT'
        },
        remove: {
          method: 'DELETE'
        }
      }
    );
  }])
  .factory('Task', [ 'TaskResource', function( TaskResource ) {
    'use strict';

    return {
      getAll: function( boardId ){
        return TaskResource.read( {id: boardId} ).$promise;
      },
      getOne: function( id ) {
        return TaskResource.read( {id: id} ).$promise;
      },
      save: function( boardId, obj ) {
        return TaskResource.create( {id: boardId}, {task: obj} ).$promise;
      },
      create: function( obj ) {
        return TaskResource.create( {task: obj} ).$promise;
      },
      update: function( id, obj ) {
        return TaskResource.update( {id: id}, {task: obj} ) .$promise;
      },
      assignToMe: function(id){
        return TaskResource.update( {id: id} ).$promise;
      },
      start: function( id ) {
        return TaskResource.update( {id: id, action: 'start'}).$promise;
      }
    };
  }]);
