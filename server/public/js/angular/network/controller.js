angular.module('baseApp.controllers')
  .controller('NetworkController', ['$scope', '$state', '$http', 'currentUser', 'Network', '_',
    function($scope, $state, $http, currentUser, Network, _){
      'use strict';

      $scope.networks = [];
      var formSetup = function(){
        var usersCache = [];
        $scope.selected = function($item) {
          var extracted = $item.match(/(.*?)&lt;(.*?)&gt;/),
            selection = _.find( usersCache, function(user){ return user.email === extracted[2]; });

          $scope.network.members[ selection._id ] = {
            _id: selection._id,
            email: selection.email,
            profile: {
              firstName: selection.profile.firstName,
              lastName: selection.profile.lastName
            }
          };
          $scope.hasMembers = $scope.network.members ? Object.keys( $scope.network.members).length : false;
          $scope.$broadcast('clearInput');
        };
        $scope.removeMember = function( id ) {
          delete $scope.network.members[ id ];
          $scope.hasMembers = $scope.network.members ? Object.keys( $scope.network.members).length : false;
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
                  return user.email !== current.email && !_.find($scope.network.members, function(i){return i.email ===user.email;});
                });
            return filteredUserList.map(function(user){
              return (user.profile.firstName ? user.profile.firstName : '') + ' ' + (user.profile.lastName ?user.profile.lastName:'') + ' &lt;'+user.email+'&gt;';
            });
          });
        };
      };
      $scope.currentUser = currentUser.get();
      switch( $state.current.name ) {
        case 'networks.new':
          $scope.network = {
            members: {}
          };
          $scope.add = function(){
            $scope.network.members = Object.keys( _.indexBy( $scope.network.members, '_id') );
            Network.add( $scope.network )
              .then( function(){
                $state.go('networks.list',{}, { reload: true });
              });
          };
          formSetup();
          break;
        case 'networks.detail':
          Network.get( $state.params.id )
             .then( function(res){
               $scope.network = res.network;
             });
          break;
        case 'networks.list':
          Network.get()
            .then( function( res ) {
              $scope.networks = res.networks;
            });
          break;
        case 'networks.edit':
          Network.get( $state.params.id )
            .then( function( res ) {
              $scope.network = res.network;
              $scope.network.members = res.network.members || {};
              $scope.hasMembers = res.network.members ? Object.keys( res.network.members).length : false;
            });
          formSetup();
          $scope.update = function( ) {
            Network.update( $scope.network )
              .then( function(){
                $state.go('networks.list');
              });
          };
          break;
        default:
          break;
      }


      $scope.remove = function( id ){
        Network.remove( id )
          .then( function(){
            $scope.networks = _.filter( $scope.networks, function(network){ return network._id !== id; });
            $state.go('networks.list');
          });
      };
    }]);