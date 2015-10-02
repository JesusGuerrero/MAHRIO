angular.module('baseApp.controllers')
  .controller('BoardController', ['$scope', '$state', '$http', 'currentUser', 'Board', '_','Notification',
    function($scope, $state, $http, currentUser, Board, _, Notification){
      'use strict';

      $scope.boards = [];
      var formSetup = function(){
        var usersCache = [];
        function findUser( $item ){
          var extracted = $item.match(/(.*?)&lt;(.*?)&gt;/),
            selection = _.find( usersCache, function(user){ return user.email === extracted[2]; });
          return selection;
        }
        $scope.selectOwner = function($item){
          var selection = findUser( $item );

          $scope.board._owner = {
            _id: selection._id,
            email: selection.email,
            profile: {
              firstName: selection.profile.firstName,
              lastName: selection.profile.lastName
            }
          };
          $scope.hasOwner = true;
          $scope.$broadcast('clearInput');
        };
        $scope.selected = function($item) {
          var selection = findUser( $item );

          $scope.board.members[ selection._id]  = {
            email: selection.email,
            profile: {
              firstName: selection.profile.firstName,
              lastName: selection.profile.lastName
            },
            _id: selection._id
          };
          $scope.hasMembers = $scope.board.members ? Object.keys($scope.board.members).length : 0;
          $scope.$broadcast('clearInput');
        };
        $scope.removeOwner = function(){
          delete $scope.board._owner;
          $scope.hasOwner = false;
        };
        $scope.removeMember = function( id ) {
          delete $scope.board.members[ id ];
          $scope.hasMembers = $scope.board.members ? Object.keys($scope.board.members).length : 0;
        };
        $scope.getUsers = function(val) {
          return $http.get('/api/autocomplete/users', {
            params: {
              q: val
            }
          }).then(function(response){
            usersCache = response.data.users;
            var filteredUserList =  _
                .filter( response.data.users, function(user){
                  return !_.find($scope.board.members, function(i){return i.email ===user.email;});
                });
            return filteredUserList.map(function(user){
              return (user.profile.firstName ? user.profile.firstName : '') + ' ' + (user.profile.lastName ?user.profile.lastName:'') + ' &lt;'+user.email+'&gt;';
            });
          });
        };
        $scope.addColumn = function(name){
          if( name ) {
            $scope.board.columns.push( {name: name});
          }
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
              $scope.hasMembers = $scope.board.members ? Object.keys($scope.board.members).length : 0;
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
        Notification.id = id;
        Notification.confirm = 'Are you sure you want to delete?';
        Notification.confirmed = false;
      };
      $scope.$watch( function(){ return Notification.confirmed; }, function(newVal) {
        if (newVal) {
          Notification.confirmed = null;
          Board.remove( Notification.id )
            .then( function(){
              $state.go('boards.list', {}, {reload: true});
            });
        }
      });
    }]);