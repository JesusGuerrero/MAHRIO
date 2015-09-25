angular.module('baseApp.controllers')
  .controller('BoardController', ['$scope', '$state', '$http', 'currentUser', 'Board', '_',
    function($scope, $state, $http, currentUser, Board, _){
      'use strict';

      $scope.boards = [];
      var formSetup = function(){
        var usersCache = [];
        $scope.selected = function($item) {
          var extracted = $item.match(/(.*?)&lt;(.*?)&gt;/),
            selection = _.find( usersCache, function(user){ return user.email === extracted[2]; });

          $scope.board.members.push({
            email: selection.email,
            profile: {
              firstName: selection.profile.firstName,
              lastName: selection.profile.lastName
            },
            _id: selection._id
          });
          $scope.$broadcast('clearInput');
        };
        $scope.removeMember = function( i ) {
          $scope.board.members.splice( i, 1);
        };
        $scope.getUsers = function(val) {
          return $http.get('/api/autocomplete/users', {
            params: {
              q: val
            }
          }).then(function(response){
            usersCache = response.data.users;
            var current = currentUser.get(),
              filteredUserList =  _
                .filter( response.data.users, function(user){
                  return user.email !== current.email && !_.find($scope.board.members, function(i){return i.email ===user.email;});
                });
            return filteredUserList.map(function(user){
              return (user.profile.firstName ? user.profile.firstName : '') + ' ' + (user.profile.lastName ?user.profile.lastName:'') + ' &lt;'+user.email+'&gt;';
            });
          });
        };
        $scope.addColumn = function(name){
          $scope.board.columns.push( {name: name});
        };
        $scope.removeColumn = function( i ) {
          $scope.board.columns.splice( i, 1);
        };
      };
      $scope.currentUser = currentUser.get();
      switch( $state.current.name ) {
        case 'boards.new':
          $scope.board = {
            members: [],
            columns: []
          };
          $scope.add = function(){
            Board.add( $scope.board )
              .then( function(){
                $state.go('boards.list',{}, { reload: true });
              });
          };
          formSetup();
          break;
        case 'boards.detail':
          $scope.board = Board.get( $state.params.id );
          break;
        case 'boards.list':
          Board.get()
            .then( function( res ) {
              $scope.boards = res.boards;
            });
          break;
        case 'boards.edit':
          Board.get( $state.params.board )
            .then( function( res ) {
              $scope.board = res.board;
            });
          formSetup();
          $scope.update = function( ) {
            Board.update( $scope.board )
              .then( function(){
                $state.go('boards.list');
              });
          };
          break;
        default:
          break;
      }

      $scope.remove = function( id ){
        Board.remove( id )
          .then( function(){
            $scope.boards = _.filter( $scope.boards, function(board){ return board._id !== id; });
            $state.go('boards.list');
          });
      };
    }]);