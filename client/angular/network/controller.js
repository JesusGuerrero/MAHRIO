angular.module('baseApp.controllers')
  .controller('NetworksController', ['$scope', '$state', 'currentUser', 'Network', 'networks', '_','Notification',
    function($scope, $state, currentUser, Network, networks, _, Notification){
      'use strict';

      $scope.networks = networks ? _.indexBy( networks, '_id') : {};

      $scope.currentUser = currentUser.get();
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
  .controller('NetworkController', ['$scope', 'network','$state','FormHelper','Network','_','currentUser',
    function($scope, network, $state, FormHelper, Network, _, currentUser ){
      'use strict';

      $scope.network = { members: {}, admins: {} };
      $scope.has = {members: false, admins: false, owner: false};
      $scope.network = _.extend( $scope.network, network);
      FormHelper.setupFormHelper($scope, 'network');

      if( $state.current.name === 'networks.edit' ) {
        $scope.has = {
          admins: $scope.network.admins ? Object.keys( $scope.network.admins).length : 0,
          members: $scope.network.members ? Object.keys( $scope.network.members).length : 0,
          owner: $scope.network.owner ? true : false
        };
      } else if( $state.current.name === 'networks.detail' ) {
        currentUser.currentNetwork = $scope.network._id;
      }
      $scope.add = function () {
        $scope.network.members = Object.keys($scope.network.members);
        $scope.network.admins = Object.keys($scope.network.admins);
        Network.add($scope.network)
          .then(function () {
            $state.go('networks.list', {}, {reload: true});
          });
      };
      $scope.update = function( ) {
        $scope.network.admins = Object.keys( $scope.network.admins );
        Network.update( $scope.network )
          .then( function(){
            $state.go('networks.list');
          });
      };
    }]);