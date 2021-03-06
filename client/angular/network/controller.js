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
      $scope.newNetwork = function(){
        $scope.networkForm = { admins: {}, members: {} };
        $('#modalNetworkForm' ).modal().show();
      };
      $scope.editNetwork = function( network ) {
        $scope.networkForm = network;
        $('#modalNetworkForm' ).modal().show();
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
      $scope.active = true;
    }])
  .controller('NetworkArticleController', ['$scope', '$state', 'articles','currentUser','Notification','Article',
    function($scope, $state, articles, currentUser, Notification, Article){
      'use strict';
      /* jshint maxstatements: 100 */
      console.log( articles );
      if( $state.current.name === 'networks.articles' ) {
        $scope.networkId = $state.params.id;
        $scope.articles = articles.length ? articles : null;
        console.log( $scope.articles );
        $scope.newArticle = function(){
          $scope.edit = null;
          $('#modalArticleForm' ).modal().show();
        };
        $scope.editArticle = function( article ){
          $scope.edit = article;
          $('#modalArticleForm' ).modal().show();
        };
        $scope.removeSelected = function(){

        };
        console.log('im in here', $state.params.view);
        if( ['list'].indexOf( $state.params.view ) !== -1 ) {
          $scope.view = 'list';
        } else {
          $scope.view = 'objects';
        }
      } else if( $state.current.name === 'networks.article' ) {
        $scope.networkId = $state.params.id;
        $scope.article = articles;
        /* global $ */
        /* global window */
        $(window).scrollTop(0);
      }
      if( currentUser.currentNetwork === null ) {
        currentUser.currentNetwork = $scope.networkId;
      }
      if( $scope.article ) {
        currentUser.currentNetworkName = $scope.article.title;
      } else {
        currentUser.currentNetworkName = 'Articles';
      }

      $scope.remove = function( id ){
        Notification.id = id;
        Notification.confirm = 'Are you sure you want to delete?' + id;
        Notification.confirmed = false;
      };
      $scope.$watch( function(){ return Notification.confirmed; }, function(newVal) {
        if (newVal) {
          Notification.confirmed = null;
          Article.remove( Notification.id )
            .then( function(){
              $state.reload();
            });
        }
      });

      $scope.active = true;

    }])
  .controller('NetworkBoardController', ['$scope', '$state', 'boards','currentUser','Notification','Board',
    function($scope, $state, boards, currentUser, Notification, Board){
      'use strict';
      /* jshint maxstatements: 100 */
      $scope.tab = {
          selected: 'scrum',
          scrum: false,
          backlog: false
        };
      if( $state.current.name === 'networks.boards' ) {
        $scope.networkId = $state.params.id;
        $scope.boards = boards.length ? boards : null;
        console.log( $scope.boards );
        $scope.newBoard = function(){
          $('#modalBoardForm' ).modal().show();
        };
        $scope.editBoard = function( board ){
          $scope.edit = board;
          $('#modalBoardForm' ).modal().show();
        };
      } else if( $state.current.name === 'networks.board' ) {
        $scope.networkId = $state.params.id;
        $scope.board = boards;
        if( ['backlog'].indexOf( $state.params.tab ) !== -1 ) {
          $scope.tab.backlog = true;
          $scope.tab.selected = 'backlog';
        } else {
          $scope.tab.scrum = true;
        }

        $scope.$on('task:edit', function(id){
          $scope.task = id;
          $('#modalTaskForm' ).modal().show();
        });

        $scope.newTask = function(){
          $('#modalTaskForm' ).modal().show();
        };
      }
      if( currentUser.currentNetwork === null ) {
        currentUser.currentNetwork = $scope.networkId;
      }
      if( $scope.board ) {
        currentUser.currentNetworkName = $scope.board.title;
      }  else {
        currentUser.currentNetworkName = 'Boards';
      }

      $scope.remove = function( id ){
        Notification.id = id;
        Notification.confirm = 'Are you sure you want to delete? ' + id;
        Notification.confirmed = false;
      };
      $scope.$watch( function(){ return Notification.confirmed; }, function(newVal) {
        if (newVal) {
          Notification.confirmed = null;
          Board.remove( Notification.id )
            .then( function(){
              $state.reload();
            });
        }
      });
      $scope.active = true;
    }])
  .controller('NetworkEventController', ['$scope', '$state', 'events','currentUser','Notification','Calendar',
    function($scope, $state, events, currentUser, Notification, Calendar){
      'use strict';

      if( $state.current.name === 'networks.events' ) {
        $scope.networkId = $state.params.id;
        $scope.events = events.length ? events : null;
        $scope.newEvent = function(){
          $scope.edit = null;
          $('#modalEventForm' ).modal().show();
        };
        $scope.editEvent = function( event ){
          $scope.edit = event;
          $('#modalEventForm' ).modal().show();
        };
      } else if( $state.current.name === 'networks.event' ) {
        $scope.networkId = $state.params.id;
        $scope.event = events;
      }
      if( currentUser.currentNetwork === null ) {
        currentUser.currentNetwork = $scope.networkId;
      }
      if( $scope.event ) {
        currentUser.currentNetworkName = $scope.event.title;
      } else {
        currentUser.currentNetworkName = 'Events';
      }

      $scope.remove = function( id ){
        Notification.id = id;
        Notification.confirm = 'Are you sure you want to delete? ' + id;
        Notification.confirmed = false;
      };
      $scope.$watch( function(){ return Notification.confirmed; }, function(newVal) {
        if (newVal) {
          Notification.confirmed = null;
          Calendar.remove( Notification.id )
            .then( function(){
              $state.reload();
            });
        }
      });

      $scope.active = true;
    }])
  .controller('NetworkMemberController', ['$scope', '$state', 'users','currentUser',
    function($scope, $state, users, currentUser){
      'use strict';

      if( $state.current.name === 'networks.members' ) {
        $scope.networkId = $state.params.id;
        $scope.users = users.length ? users : null;
        console.log( $scope.boards );
        $scope.newUser = function(){
          $('#modalUserForm' ).modal().show();
        };
      } else if( $state.current.name === 'networks.member' ) {
        $scope.networkId = $state.params.id;
        $scope.user = users;
      }
      if( currentUser.currentNetwork === null ) {
        currentUser.currentNetwork = $scope.networkId;
      }
      if( $scope.user ) {
        currentUser.currentNetworkName = $scope.user.title;
      } else {
        currentUser.currentNetworkName = 'Users';
      }
      $scope.active = true;
    }]);