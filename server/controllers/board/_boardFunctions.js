'use strict';

var async = require('async'),
  _ = require('underscore'),
  Boom = require('boom'),
  mongoose = require('mongoose'),
  Board = mongoose.model('Board'),
  Task = mongoose.model('Task'),
  Column = mongoose.model('Column');

function _removeColumn( columns, board, next ){
  if( columns.length ) {
    var tasks = _.filter( board.tasks, function(task){ return _.filter( columns, function(col) { return col.id === task._column; }).length; });
    tasks = _.map( tasks, function(task){ return task._id; });
    async.forEach( columns, function(item, callback){
      Column.remove( {_id: item._id}, function(){
        callback();
      });
    }, function(){
      Task.update( {_id : {$in: tasks}}, { $set : { _column: null }}, {multi: true}, function(){
        next();
      });
    });
  } else {
    next();
  }
}
function _createColumns( columns ) {
  return Column.create( columns );
}
function _updateBoard( request, reply, board) {
  var oldColumns = _.filter( board.columns, function(col){ return !_.findWhere(request.payload.board.columns, {_id: col.id, name: col.name}); });

  _removeColumn( oldColumns, board, function(){
    board.columns = _.map( request.payload.board.columns, function(column){ return column._id;});
    board.members = _.map( request.payload.board.members, function(member) {return member._id;});
    board.save( function(err, brd) {
      if( err ) { return reply( Boom.badRequest(err) ); }

      reply( {board: brd} );
    });
  });
}

function updateBoard( request, reply ) {
  if( request.params.id ) {
    Board
      .findOne( { _id: request.params.id, _owner: request.auth.credentials.id })
      .select('name columns members tasks')
      .populate([{
        path: 'columns',
        select: 'name'
      }, {
        path: 'tasks',
        select: 'title _column'
      }])
      .exec( function(err, board){
        if( err ) { return Boom.badRequest(err); }

        var newColumns = _.filter( request.payload.board.columns, function(item){ return !item._id; });
        request.payload.board.columns = _.filter( request.payload.board.columns, function(item){ return item._id; });
        if( newColumns.length ) {
          _createColumns( newColumns )
            .then(function(columns){
              _.each( columns, function(item){ request.payload.board.columns.push(item); });
              _updateBoard( request, reply, board);
            });
        } else {
          _updateBoard( request, reply, board);
        }
      });
  } else {
    reply( Boom.badRequest('board id not found') );
  }
}

function _createBoard( request ){
  request.payload.board._owner = request.auth.credentials.id;
  request.payload.board.members = _.map( request.payload.board.members, function(member) {return member._id;});
  request.payload.board.columns = _.map( request.payload.board.columns, function(column){ return column.id;});
  request.payload.board.tasks = [];

  return new Board( request.payload.board).save();
}
function createBoard( request, reply ) {
  if( !_.contains(request.auth.credentials.access, 'admin') && !_.contains(request.auth.credentials.access, 'sudo') ) {
    return reply( Boom.forbidden() );
  }
  if( !request.payload.board ) {
    return reply( Boom.badRequest() );
  }
  _createColumns(request.payload.board.columns )
    .then( function(columns){
      request.payload.board.columns = columns;
      _createBoard( request )
        .then( function(board){
          return reply( {board: board} );
        }, function(err){
          return reply( Boom.badRequest(err) );
        });
    }, function(err){
      return reply(Boom.badRequest(err));
    });

}
function getBoard( request, reply ) {
  var query;
  if( request.params.id ) {
    query = Board.findOne({});
    query
      .and([{
          _id: request.params.id
        },
        {
          $or: [{
            members: {$in: [request.auth.credentials.id]}
          },{
            _owner: request.auth.credentials.id
          }]
        },
        {
          _removed: false
        }])
      .select('name created members columns tasks _owner startColumn')
      .populate([{
        path: 'members',
        select: 'firstName lastName email'
      },{
        path: 'columns',
        select: 'name'
      }, {
        path: 'tasks'
      }])
      .exec( function(err, board){
        if( err ) { return reply( Boom.badRequest() ); }

        reply( {board: board} );
      });
  } else {
    query = Board.find({});
    query
      .and([
        {
          $or: [{
            members: {$in: [request.auth.credentials.id]}
          },{
            _owner: request.auth.credentials.id
          }]
        },
        {
          _removed: false
        }])
      .select('name created members columns _owner')
      .populate([{
        path: 'members',
        select: 'firstName lastName email'
      },{
        path: 'columns',
        select: 'name'
      }])
      .exec( function(err, boards){
        if( err ) { return reply( Boom.badRequest(err) ); }

        reply( {boards: boards} );
      });
  }
}
function removeBoard(request, reply){
  if( request.params.id ) {
    Board
      .findOne( { _id: request.params.id, _owner: request.auth.credentials.id })
      .select('_removed ')
      .exec( function(err, board){
        if( err ) { return Boom.badRequest(err); }

        board._removed = true;

        board.save( function(err) {
          if( err ) { return reply( Boom.badRequest(err) ); }

          reply( {removed: true} );
        });
      });
  } else {
    reply( Boom.badRequest('board id not found') );
  }
}


module.exports = {
  create: createBoard,
  get: getBoard,
  update: updateBoard,
  remove: removeBoard
};