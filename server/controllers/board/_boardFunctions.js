'use strict';

var async = require('async'),
  _ = require('underscore'),
  Boom = require('boom'),
  mongoose = require('mongoose'),
  Board = mongoose.model('Board'),
  Task = mongoose.model('Task'),
  Column = mongoose.model('Column'),
  User = mongoose.model('User'),
  Network = mongoose.model('Network');

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
      .findOne( { _id: request.params.id, owner: request.auth.credentials.id })
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
  request.payload.board.owner = request.auth.credentials.id;
  request.payload.board.members = _.map( request.payload.board.members, function(member) {return member._id;});
  request.payload.board.columns = _.map( request.payload.board.columns, function(column){ return column.id;});
  request.payload.board.tasks = [];

  return new Board( request.payload.board).save();
}
function _getNetwork( request, reply, callback ) {
  Network
    .findOne({_id: request.params.networkId})
    .exec( function(err, network){
      if( err || !network ) { return reply( Boom.badRequest()); }

      if( typeof callback === 'function') {
        callback( network );
      } else {
        return reply( Boom.badRequest());
      }
    });
}
function createBoard( request, reply ) {
  if( !_.contains(request.auth.credentials.access, 'admin') && !_.contains(request.auth.credentials.access, 'sudo') ) {
    return reply( Boom.forbidden() );
  }
  if( !request.payload.board ) {
    return reply( Boom.badRequest('no board present') );
  }
  _getNetwork( request, reply, function(network){
    if( network.admins.indexOf( request.auth.credentials.id ) !== -1 || request.auth.credentials.access.indexOf('admin') !== -1 ||
      network.owner === request.auth.credentials.id ||  request.auth.credentials.access.indexOf('sudo') !== -1) {
      _createColumns(request.payload.board.columns)
        .then(function (columns) {
          request.payload.board.columns = columns;
          request.payload.board.network = network.id;
          _createBoard(request)
            .then(function (board) {
              network.boards.push( board.id );
              network.save( function(err){
                if( err ){ return reply( Boom.badRequest('not able to update board in network'));}

                return reply({board: board});
              });
            }, function () {
              return reply(Boom.badRequest('cannot create board'));
            });
        }, function () {
          return reply(Boom.badRequest('cannot create columns'));
        });
    } else {
      return reply(Boom.badRequest('not admin of network or not admin or you are not network owner'));
    }
  });
}
function _getBoardMembers( board, callback ) {
  User
    .find( {_id: {$in: board.members}})
    .select('email profile avatarImage')
    .populate('profile avatarImage')
    .exec( function(err, users){
      if( err ) { callback(err); }

      board._doc.members = _.indexBy( users, '_id');

      callback( false );
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
            owner: request.auth.credentials.id
          }]
        },
        {
          _removed: false
        }])
      .select('name created members columns tasks owner startColumn')
      .populate([{
        path: 'columns',
        select: 'name'
      }, {
        path: 'tasks'
      }])
      .exec( function(err, board){
        if( err ) { return reply( Boom.badRequest(err) ); }

        _getBoardMembers( board, function(err){
          if( err ) { return reply( Boom.badRequest(err) ); }

          return reply( {board: board} );
        });
      });
  } else {
    query = Board.find({});
    query
      .and([
        {
          $or: [{
            members: {$in: [request.auth.credentials.id]}
          },{
            owner: request.auth.credentials.id
          }]
        },
        {
          _removed: false
        }])
      .select('name created members columns owner')
      .populate([{
        path: 'columns',
        select: 'name'
      }])
      .exec( function(err, boards){
        if( err ) { return reply( Boom.badRequest(err) ); }

        async.each( boards, function(board, callback){
          _getBoardMembers( board, function(err){
            if( err ) { return reply( Boom.badRequest() ); }

            callback();
          });
        }, function(){
          return reply( {boards: boards} );
        });
      });
  }
}
function removeBoard(request, reply){
  if( request.params.id ) {
    Board
      .findOne( { _id: request.params.id, owner: request.auth.credentials.id })
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