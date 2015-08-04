'use strict';

var _ = require('underscore'),
  Boom = require('boom'),
  mongoose = require('mongoose'),
  Task = mongoose.model('Task'),
  Board = mongoose.model('Board');

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
        delete task._board;

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
  request.payload.task._creator = request.auth.credentials.id;
  var task = new Task( request.payload.task );

  Board.findOne( { _id: request.payload.task._board }, function(err, board){
    if( err ) { return reply( Boom.badRequest(err) ); }

    if( board ){
      task.save( function(err, task) {
        if( err ) { return reply( Boom.badRequest(err) ); }

        board.tasks.push( task.id );
        board.save( function(err){
          if( err ) { return reply( Boom.badRequest(err) ); }

          reply( {task: task} );
        });
      });
    } else {
      return reply( Boom.badRequest('Board not found') );
    }
  });
}
function getFromBoard( request, reply ){
  Task
    .find( { _board: request.params.id } )
    .populate([{
      path: 'assignedTo',
      select: 'firstName lastName email'
    }])
    .exec( function(err, tasks){
      if( err ) { return reply( Boom.badRequest() ); }

      reply( {tasks: tasks} );
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
function start( request, reply ) {
  if( request.params.id ) {
    Task.update( {_id: request.params.id}, { $set : { start : true } }, function(err,task){
      if( err ) return Boom.badRequest(err);

      reply();
    })
  } else {
    reply( Boom.badRequest() );
  }
}

module.exports = {
  create: createTask,
  get: getTask,
  update: updateTask,
  start: start,
  getFromBoard: getFromBoard
};