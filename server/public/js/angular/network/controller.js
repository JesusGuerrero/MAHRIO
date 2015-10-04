angular.module('baseApp.controllers')
  .controller('NetworksController', ['$scope', '$state', '$http', 'currentUser', 'Network', '_','Notification',
    function($scope, $state, $http, currentUser, Network, _, Notification){
      'use strict';
      console.log( 'in networks');
      $scope.networks = [];
      var formSetup = function(){
        var usersCache = [];
        function findUser( $item ){
          var extracted = $item.match(/(.*?)&lt;(.*?)&gt;/),
            selection = _.find( usersCache, function(user){ return user.email === extracted[2]; });
          return selection;
        }
        $scope.selectOwner = function($item){
          var selection = findUser( $item );

          $scope.network.owner = {
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
        $scope.selectedModerator = function($item){
          var selection = findUser( $item );

          $scope.network.admins[ selection._id ] = {
            _id: selection._id,
            email: selection.email,
            profile: {
              firstName: selection.profile.firstName,
              lastName: selection.profile.lastName
            }
          };
          $scope.hasModerators = $scope.network.admins ? Object.keys( $scope.network.admins).length : false;
          $scope.$broadcast('clearInput');
        };
        $scope.removeMember = function( id ) {
          delete $scope.network.members[ id ];
          $scope.hasMembers = $scope.network.members ? Object.keys( $scope.network.members).length : false;
        };
        $scope.removeOwner = function(){
          $scope.hasOwner = false;
        };
        $scope.removeModerator = function( id ) {
          delete $scope.network.admins[ id ];
          $scope.hasModerators = $scope.network.admins ? Object.keys( $scope.network.admins).length : false;
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
            members: {},
            admins: {}
          };
          $scope.add = function(){
            $scope.network.members = Object.keys( _.indexBy( $scope.network.members, '_id') );
            $scope.network.admins = Object.keys( _.indexBy( $scope.network.admins, '_id') );

            Network.add( $scope.network )
              .then( function(){
                $state.go('networks.list',{}, { reload: true });
              });
          };
          formSetup();
          break;
        case 'networks.detail.boards':
        case 'networks.detail':
          console.log('in detail');
          Network.get( $state.params.id )
             .then( function(res){
               $scope.network = res.network;
             });
          break;
        case 'networks.list':
          Network.get()
            .then( function( res ) {
              $scope.networks = _.indexBy( res.networks, '_id');
            });
          break;
        case 'networks.edit':
          Network.get( $state.params.id )
            .then( function( res ) {
              $scope.network = res.network;
              $scope.network.members = res.network.members || {};
              $scope.network.admins = res.network.admins || {};
              $scope.hasMembers = res.network.members ? Object.keys( res.network.members).length : false;
              $scope.hasModerators = $scope.network.admins ? Object.keys( $scope.network.admins).length : false;
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
        Notification.id = id;
        Notification.confirm = 'Are you sure you want to delete?';
        Notification.confirmed = false;
      };
      $scope.$watch( function(){ return Notification.confirmed; }, function(newVal) {
        if (newVal) {
          Notification.confirmed = null;
          Network.remove( Notification.id )
            .then( function(){
              $state.go('networks.list', {}, {reload: true});
            });
        }
      });
      $scope.requestAdmin = function( id ) {
        Network.requestAdmin( {_id: id})
          .then( function(){
            /* global alert */
            alert('Your submission was requested');
          });
      };
      $scope.join = function( id ){
        Network.join( {_id: id} )
          .then( function(){
            currentUser.get().networks.push( $scope.networks[id] );
            $state.reload();
          });
      };
      $scope.leave = function( id ){
        Network.leave( {_id: id} )
          .then( function(){
            var id = currentUser.get().networks.indexOf( $scope.networks[id] );
            currentUser.get().networks.splice(id, 1);
            $state.reload();
          });
      };
    }])
  .controller('NetworkController', ['$scope', 'network',
    function($scope, network){
      'use strict';
      $scope.network = network;
    }]);