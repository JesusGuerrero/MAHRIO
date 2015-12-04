angular.module('starter.controllers', [])
  .controller('HomeCtrl', function($scope, Users, Modal){
    $scope.modal = {};
    $scope.openModal = function(){
      $scope.modal.show();
    };
    $scope.form = {};
    $scope.addObject = function() {
      $scope.modal.hide();
    };
    $scope.$on('modal:destroy', function() {
      for( var key in $scope.modal ) {
        $scope.modal[ key ].remove();
      }
    });

    $scope.$on('provision:modal:register', function(event, eventObject){
      Modal.provisionModal(eventObject.scope, 'templates/modal-register.html').then(function(modal){
        $scope.modal.register = modal;
        $scope.modal.register.show();
      });
    });
    $scope.$on('provision:modal:demo', function(event, eventObject){
      Modal.provisionModal(eventObject.scope, 'templates/modal-demo.html').then( function(modal){
        $scope.modal.demo = modal;
        $scope.modal.demo.show();
      })
    });
    $scope.$on('provision:modal:login', function(event, eventObject){
      Modal.provisionModal(eventObject.scope, 'templates/modal-login.html').then(function(modal){
        $scope.modal.login = modal;
        $scope.modal.login.show();
      });
    });
    $scope.$on('provision:modal:chat', function( event, eventObject ){
      Modal.provisionModal(eventObject.scope, 'templates/modal-chat.html').then(function(modal){
        $scope.modal.chat = modal;
        $scope.modal.chat.show();
        console.log( $scope.modal.chat );
      });
    });
    $scope.$on('provision:modal:networks', function(event, eventObject){
      Modal.provisionModal(eventObject.scope, 'templates/modal-all-networks.html').then(function(modal){
        $scope.modal.networks = modal;
        $scope.modal.networks.show();
      });
    });

    //console.log( 'im in here' + Users.getCurrentId() );
  })
  .controller('TabNotificationCtrl', function($scope, Notification){
    $scope.chatBadge = 0;
    $scope.$watch( function(){ return Notification.getChat(); }, function(newVal){
      if( newVal ) {
        $scope.chatBadge = newVal;
        $scope.$broadcast('event:chat:badge');
        Notification.resetChat();
      }
    });
  })
  .controller('OfflineCtrl', function($scope){

  })

  .controller('DashCtrl', function($scope, Users) {
    $scope.$on('$ionicView.enter', function() {
      if( Users.hasCurrent() ) {
        console.log( 'has current user' );
      }
    });
  })

  .controller('NetworksCtrl', function( $scope, $ionicLoading, Networks, Users, _) {
    var networks, myNetworkIds = Object.keys( _.indexBy( Users.getNetworks( ), '_id') );
    $ionicLoading.show({
      template: 'Loading...'
    });
    Networks.get().then( function(data){
      $ionicLoading.hide();
      networks = data;
      var myNetworks = _.filter( networks, function(network){ return _.contains( myNetworkIds, network._id ); });
      $scope.networks = _.indexBy( myNetworks, '_id');
    });
    $scope.provisionNetworksModal = function(){
      var otherNetworks = _.filter(networks, function(network){ return !_.contains( myNetworkIds, network._id ); });
      $scope.otherNetworks = _.indexBy( otherNetworks, '_id');

      $scope.joinNetwork = function( network ) {
        $ionicLoading.show({
          template: 'Joining...'
        });
        Networks.join( network ).then( function(){
          $ionicLoading.hide();
          myNetworkIds.push( network._id );
          $scope.networks[ network._id ] = network;
          delete $scope.otherNetworks[ network._id ];
        });
      };
      $scope.leaveNetwork = function( network ) {
        $ionicLoading.show({
          template: 'Leaving...'
        });
        Networks.leave( network ).then( function(){
          $ionicLoading.hide();
          myNetworkIds.splice( myNetworkIds.indexOf( network._id ), 1);
          $scope.otherNetworks[ network._id ] = network;
          delete $scope.networks[ network._id ];
        });
      };
      $scope.$emit('provision:modal:networks',{
        scope: $scope
      });
    };

  })
  .controller('NetworkDetailCtrl', function( $scope, $stateParams, Networks) {
    $scope.network = Networks.getOne( $stateParams.networkId );

    $scope.confirmStatusChanges = function() {
      $scope.data = {};
      var myPopup = $ionicPopup.show({
        template: '<input type="password" ng-model="data.wifi" style="padding:0 10px">',
        title: 'Confirm Departure',
        subTitle: 'Please enter account password',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Leave</b>',
            type: 'button-stable',
            onTap: function(e) {
              if (!$scope.data.wifi) {
                e.preventDefault();
              } else {
                return $scope.data.wifi;
              }
            }
          }
        ]
      });
      myPopup.then(function(res) {
        console.log('Tapped!', res);
      });
    };
  })
  .controller('ArticlesCtrl', function($scope, $stateParams, $ionicLoading, Networks ) {
    $scope.networkId = $stateParams.network;
    $ionicLoading.show({
      template: 'Loading...'
    });
    Networks.getArticles( $scope.networkId ).then( function(articles) {
      $ionicLoading.hide();
      $scope.articles = articles;
    });
  })
  .controller('ArticleDetailCtrl', function($scope, $stateParams, Networks){
    $scope.article = Networks.getArticle( $stateParams.articleId );
  })
  .controller('BoardsCtrl', function($scope, $stateParams, Networks){
    $scope.networkId = $stateParams.network;
    $scope.boards = Networks.getBoards( $stateParams.network );
  })
  .controller('BoardDetailCtrl', function($scope, $stateParams, Networks){
    $scope.board = Networks.getBoards( $stateParams.network, $stateParams.boardId );
  })
  .controller('EventsCtrl', function($scope, $stateParams, $ionicLoading, Networks){
    $scope.networkId = $stateParams.network;
    $ionicLoading.show({
      template: 'Loading...'
    });
    Networks.getEvents( $scope.networkId ).then( function(events) {
      $ionicLoading.hide();
      $scope.events = events;
    });
  })
  .controller('EventDetailCtrl', function($scope, $stateParams, Networks){
    $scope.event = Networks.getEvent( $stateParams.eventId );
  })
  .controller('HardwareCtrl', function($scope, $stateParams, Networks){
    $scope.networkId = $stateParams.network;
    $scope.harware = Networks.getHardware( $stateParams.network );
  })
  .controller('HardwareDetailCtrl', function($scope, $stateParams, Networks){
    $scope.hardware = Networks.getHardware( $stateParams.network, $stateParams.hardwareId );
  })
  .controller('MembersCtrl', function($scope, $stateParams, $ionicLoading, Networks ){
    $scope.networkId = $stateParams.network;
    $ionicLoading.show({
      template: 'Loading...'
    });
    Networks.getMembers( $scope.networkId ).then( function(members) {
      $ionicLoading.hide();
      $scope.members = members;
    });

    //$scope.network = Users.getOneNetwork( $stateParams.network );

  })
  .controller('MemberDetailCtrl', function($scope, $stateParams, Networks, Users ){
    $scope.currentId = Users.getCurrentId();
    if( typeof $stateParams.memberId !== 'undefined' ) {
      $scope.member = Networks.getMember( $stateParams.memberId );
    } else {
      $scope.member = Users.getCurrentUser();
    }

  })

  .controller('ChatsCtrl', function($scope, Users, Chats, Messages, $ionicActionSheet, $ionicLoading ) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    $scope.currentId = Users.getCurrentId();
    $scope.$on('event:chat:badge', function(){
      Chats.all().then( function(chats){ $scope.chats = chats; });
    });
    $scope.$on('$ionicView.enter', function() {
      $ionicLoading.show({
        template: 'Loading...'
      });
      Chats.all().then( function(chats){
        $ionicLoading.hide();
        $scope.chats = chats;
      });
      $scope.sendMessage = function( ) {
        if( $scope.chat._id ) {
          Chats.sendMessage( $scope.chat._id, Object.keys( $scope.chat.members ), $scope.chat.newMessage ).then( function(msg) {
            $scope.chat.messages.splice( 0, 0, msg );
          });
        } else {
          Chats.startConversation( [$scope.chat.otherMember, $scope.currentId], $scope.chat.newMessage).then( function(){
            $scope.$emit('modal:destroy');
          });

          //
          //var chat = Chats.add( [$scope.current.id, $scope.chat.otherMember], [] );
          //var msg = Messages.add( chat.id, $scope.current.id, $scope.chat.newMessage );
          //Chats.updateMessages( chat.id, msg.id );
          //Messages.updateChat( msg.id, chat.id );
          //$scope.chat = Chats.get( chat.id );
          //$scope.chats = Chats.all();
        }
        $scope.chat.newMessage = '';
      };
      $scope.remove = function(chatId) {
        if( Chats.remove(chatId) ) {
          $scope.chats = Chats.all();
        }
      };
      $scope.menu = function(){
        $ionicActionSheet.show({
          buttons: [
            { text: 'Insert Image' },
            { text: 'Insert Video' },
            { text: 'Insert File' }
          ],
          titleText: 'Options',
          cancelText: 'Cancel',
          cancel: function() {
            // add cancel code..
          },
          buttonClicked: function() {
            return true;
          }
        });
      };
      $scope.provisionChatModal = function( id ){
        if( typeof id !== 'undefined'){
          $scope.chat = $scope.chats[ id ];
          $scope.$emit('provision:modal:chat', {
            id: id,
            scope: $scope,
            chat: $scope.chat
          });
        } else {
          $ionicLoading.show({
            template: 'Loading...'
          });
          $scope.chat = {};
          Users.getAll().then( function(res) {
            $ionicLoading.hide();
            $scope.users = _.indexBy( res.data.users, '_id' );
            delete $scope.users[ $scope.currentId ];
            $scope.$emit('provision:modal:chat', {
              id: id,
              scope: $scope,
              chat: $scope.chat
            });
          });
        }
      };
    });
  })
  .controller('SearchCtrl', function( $scope) {

  })
  .controller('AccountCtrl', function($scope, $state, Users) {
    $scope.settings = {
      enableFriends: true
    };
    $scope.logout = function(){
      Users.logout();
      $state.go('offline');
    }
  });
