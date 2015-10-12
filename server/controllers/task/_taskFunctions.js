'use strict';

var Boom = require('boom'),
  mongoose = require('mongoose'),
  Task = mongoose.model('Task'),
  Board = mongoose.model('Board');

//function updateTask( request, reply ) {
//  if( request.params.id ) {
//    Task
//      .findOne( { _id: request.params.id })
//      .exec( function(err, task){
//        if( err ) { return Boom.badRequest(); }
//
//        if( typeof request.payload.task === 'undefined'){
//          task.assignedTo = request.auth.credentials.id;
//        } else {
//          task = _.extendOwn( task, request.payload.task );
//        }
//        delete task._board;
//
//        task.save( function(err, task) {
//          if( err ) { return reply( Boom.badRequest() ); }
//
//          reply( {task: task} );
//        });
//      });
//  } else {
//    reply( Boom.badRequest() );
//  }
//}
//function createTask( request, reply ) {
//  if( request.payload.task._id ) {
//    request.params.id = request.payload.task._id;
//    return updateTask( request, reply);
//  }
//  request.payload.task._creator = request.auth.credentials.id;
//  var task = new Task( request.payload.task );
//
//  Board.findOne( { _id: request.payload.task._board }, function(err, board){
//    if( err ) { return reply( Boom.badRequest(err) ); }
//
//    if( board ){
//      task.save( function(err, task) {
//        if( err ) { return reply( Boom.badRequest(err) ); }
//
//        board.tasks.push( task.id );
//        board.save( function(err){
//          if( err ) { return reply( Boom.badRequest(err) ); }
//
//          reply( {task: task} );
//        });
//      });
//    } else {
//      return reply( Boom.badRequest('Board not found') );
//    }
//  });
//}
//function getFromBoard( request, reply ){
//  Task
//    .find( { _board: request.params.id } )
//    .populate([{
//      path: 'assignedTo',
//      select: 'firstName lastName email'
//    }])
//    .exec( function(err, tasks){
//      if( err ) { return reply( Boom.badRequest() ); }
//
//      reply( {tasks: tasks} );
//    });
//}
//function getTask( request, reply ) {
//  if( request.params.id ) {
//    Task
//      .findOne( { _id: request.params.id })
//      .exec( function(err, task){
//        if( err ) { return reply( Boom.badRequest() ); }
//
//        reply( {task: task} );
//      });
//  } else {
//    Task
//      .find( )
//      .exec( function(err, tasks){
//        if( err ) { return reply( Boom.badRequest() ); }
//
//        reply( {tasks: tasks} );
//      });
//  }
//}
function start( request, reply ) {
  if( request.params.id ) {
    Task.update( {_id: request.params.id, assignedTo: request.auth.credentials.id}, { $set : { start : true } }, function(err){
      if( err ) { return Boom.badRequest(err); }

      reply({start: true});
    });
  } else {
    reply( Boom.badRequest() );
  }
}
function _getBoard( request, reply, callback ) {
  if( request.params.boardId ) {
    Board
      .findOne({_id: request.params.boardId })
      .select( 'network')
      .populate( 'network' )
      .exec( function(err, board){
        if( err || !board ) { return reply( Boom.badRequest() ); }

        if( typeof callback === 'function' ) {
          callback( board );
        } else {
          return reply( Boom.badRequest() );
        }
      });
  } else {
    return reply( Boom.badRequest() );
  }
}
function _getTask( request, reply, callback ) {
  Task
    .findOne({_id: request.query.taskId})
    .select( 'board')
    .populate( 'board')
    .exec( function(err, task){
      if( err || !task ) { return reply( Boom.badRequest() ); }

      if( (typeof callback === 'function' && task.board.members.indexOf( request.auth.credentials.id )) !== -1 ||
        request.auth.credentials.access.indexOf('sudo') !== -1 ) {
        callback( task );
      } else {
        return reply( Boom.badRequest() );
      }
    });
}
function getAllFromBoardId( request, reply ) {
  _getBoard( request, reply, function(board){
    if( board.network.members.indexOf( request.auth.credentials.id ) !== -1 ) {
      Task.find({board: board.id }, function(err, tasks) {
        if( err ) { return reply( Boom.badRequest() ); }

        return reply( {tasks: tasks} );
      });
    } else {
      return reply( Boom.forbidden() );
    }
  });
}
function updateTask ( request, reply ) {
  _getTask( request, reply, function(task){
    task.title = request.payload.task.title;

    task.save( function(err, task) {
      if( err || !task ) { return reply( Boom.badRequest() ); }

      reply({task: task});
    });
  });
}
function createTask( request, reply ) {
  _getBoard( request, reply, function(board){
    if( board.network.members.indexOf( request.auth.credentials.id ) !== -1 ) {
      request.payload.task.board = request.query.boardId;
      Task.create( request.payload.task , function(err, task) {
        if( err || !task ) { return reply( Boom.badRequest() ); }

        Board.update({_id: board.id}, {$push: {tasks: task.id}}, {multi: false}, function(err) {
          if( err ) { return reply( Boom.badRequest() ); }

          return reply( {task: task} );
        });
      });
    } else {
      return reply( Boom.forbidden() );
    }
  });
}
function removeTask( request, reply ) {
  _getTask( request, reply, function( task ) {
    if( task.owner === request.auth.credentials.id || request.auth.credentials.access.indexOf('admin') !== -1 ) {
      task.remove( function(err){
        if( err ) { return reply( Boom.badRequest() ); }

        reply({remove: true});
      });
    } else {
       reply( Boom.forbidden() );
    }


  });
}
module.exports = {
  //create: createTask,
  //get: getTask,
  //update: updateTask,
  start: start,
  //getFromBoard: getFromBoard,
  //getAllFromBoardId: getAllFromBoardId
  get: getAllFromBoardId,
  create: createTask,
  update: updateTask,
  remove: removeTask
};