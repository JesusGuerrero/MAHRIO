'use strict';

var _ = require('underscore'),
  Boom = require('boom'),
  mongoose = require('mongoose'),
  Task = mongoose.model('Task');

function updateTask( request, reply ) {
  if( request.params.id ) {
    Task
      .findOne( { _id: request.params.id })
      .exec( function(err, task){
        if( err ) { return Boom.badRequest(); }

        if( typeof request.payload.task === 'undefined'){
          task.assignedTo = request.auth.credentials.id;
        } else {
          task = _.extendOwn( task, request.payload.task );
        }

        task.save( function(err, task) {
          if( err ) { return reply( Boom.badRequest() ); }

          reply( {task: task} );
        });
      });
  } else {
    reply( Boom.badRequest() );
  }
}
function createTask( request, reply ) {
  if( request.payload.task._id ) {
    request.params.id = request.payload.task._id;
    return updateTask( request, reply);
  }
  request.payload.task.createdBy = request.auth.credentials.id;
  var task = new Task( request.payload.task );

  task.save( function(err, task) {
    if( err ) { return reply( Boom.badRequest() ); }

    reply( {task: task} );
  });
}
function getTask( request, reply ) {
  if( request.params.id ) {
    Task
      .findOne( { _id: request.params.id })
      .exec( function(err, task){
        if( err ) { return reply( Boom.badRequest() ); }

        reply( {task: task} );
      });
  } else {
    Task
      .find( )
      .exec( function(err, tasks){
        if( err ) { return reply( Boom.badRequest() ); }

        reply( {tasks: tasks} );
      });
  }
}


module.exports = {
  create: createTask,
  get: getTask,
  update: updateTask
};