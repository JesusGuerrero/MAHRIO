angular.module('baseApp.controllers')
  .controller('NetworksController', ['$scope', '$state', 'currentUser', 'Network', 'networks', '_','Notification',
    function($scope, $state, currentUser, Network, networks, _, Notification){
      'use strict';

      $scope.networks = networks ? _.indexBy( networks, '_id') : {};
      $scope.hasNetworks = Object.keys( $scope.networks).length ? true : false;
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

      console.log( 'inside network controller', $state.current.name );

      $scope.network = { members: {}, admins: {} };
      $scope.has = {members: false, admins: false, owner: false};
      $scope.network = _.extend( $scope.network, network);
      FormHelper.setupFormHelper($scope, 'network', Network );

      if( $state.current.name === 'networks.edit' ) {
        $scope.has = {
          admins: $scope.network.admins ? Object.keys( $scope.network.admins).length : 0,
          members: $scope.network.members ? Object.keys( $scope.network.members).length : 0,
          owner: $scope.network.owner ? true : false
        };
      } else if( /networks\.detail/.test( $state.current.name ) ) {
        currentUser.currentNetwork = $scope.network._id;
        currentUser.currentNetworkName = $scope.network.name;
        console.log('set name');
      }
      $scope.add = function () {
        $scope.network.members = Object.keys($scope.network.members);
        $scope.network.admins = Object.keys($scope.network.admins);
        $scope.network.owner = $scope.network.owner || {};
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
    }])
  .controller('NetworkArticleController', ['$scope', '$state', 'articles','currentUser',
    function($scope, $state, articles, currentUser){
      'use strict';
      console.log( articles );
      if( $state.current.name === 'networks.articles' ) {
        $scope.networkId = $state.params.id;
        $scope.articles = articles;
        console.log( $scope.articles );
      } else if( $state.current.name === 'networks.article' ) {
        $scope.networkId = $state.params.id;
        $scope.article = articles;
        console.log( $scope.article );
      }
      if( currentUser.currentNetwork === null ) {
        currentUser.currentNetwork = $scope.networkId;
      }
      if( $scope.article ) {
        currentUser.currentNetworkName = $scope.article.title;
      }
    }])
  .controller('NetworkBoardController', ['$scope', '$state', 'boards','currentUser',
    function($scope, $state, boards, currentUser){
      'use strict';

      if( $state.current.name === 'networks.boards' ) {
        $scope.networkId = $state.params.id;
        $scope.boards = boards;
        console.log( $scope.boards );
      } else if( $state.current.name === 'networks.board' ) {
        $scope.networkId = $state.params.id;
        $scope.board = boards;
      }
      if( currentUser.currentNetwork === null ) {
        currentUser.currentNetwork = $scope.networkId;
      }
      if( $scope.board ) {
        currentUser.currentNetworkName = $scope.board.title;
      }
      $scope.tab = {
        scrum: false,
        backlog: false,
        newTask: false,
        editTask: false
      };
      if( ['scrum','backlog','newTask','editTask'].indexOf( $state.params.tab ) === -1 ) {
        $scope.tab.scrum = true;
      } else {
        $scope.tab[ $state.params.tab ] = true;
      }
    }])
  .controller('NetworkEventController', ['$scope', '$state', 'events','currentUser',
    function($scope, $state, events, currentUser){
      'use strict';

      if( $state.current.name === 'networks.events' ) {
        $scope.networkId = $state.params.id;
        $scope.events = events;
      } else if( $state.current.name === 'networks.event' ) {
        $scope.networkId = $state.params.id;
        $scope.event = events;
      }
      if( currentUser.currentNetwork === null ) {
        currentUser.currentNetwork = $scope.networkId;
      }
      if( $scope.event ) {
        currentUser.currentNetworkName = $scope.event.title;
      }
    }])
  .controller('NetworkMemberController', ['$scope', '$state', 'users','currentUser',
    function($scope, $state, users, currentUser){
      'use strict';

      if( $state.current.name === 'networks.members' ) {
        $scope.networkId = $state.params.id;
        $scope.users = users;
        console.log( $scope.boards );
      } else if( $state.current.name === 'networks.member' ) {
        $scope.networkId = $state.params.id;
        $scope.user = users;
      }
      if( currentUser.currentNetwork === null ) {
        currentUser.currentNetwork = $scope.networkId;
      }
      if( $scope.user ) {
        currentUser.currentNetworkName = $scope.user.title;
      }
    }]);