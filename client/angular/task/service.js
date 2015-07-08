angular.module('baseApp.services')
  .factory('TaskResource', [ '$resource', function($resource) {
    'use strict';
    return $resource('/api/tasks/:id',
      { id: '@id' },
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
      getAll: function(){
        return TaskResource.read().$promise;
      },
      getOne: function( id ) {
        return TaskResource.read( {id: id} ).$promise;
      },
      save: function( obj ) {
        return TaskResource.create( {task: obj} ).$promise;
      },
      create: function( obj ) {
        return TaskResource.create( {task: obj} ).$promise;
      },
      update: function( id, obj ) {
        return TaskResource.update( {id: id}, {task: obj} ) .$promise;
      },
      assignToMe: function(id){
        return TaskResource.update( {id: id} ).$promise;
      }
    };
  }]);
