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
  .controller('TabNotificationCtrl', function($scope, $rootScope, Notification){
    $scope.chatBadge = 0;
    $scope.$watch( function(){ return Notification.getChat(); }, function(newVal){
      if( newVal ) {
        $scope.$broadcast('event:chat:badge');
        Notification.resetChat();
        console.log( 'broadcast event chat badge');
        $scope.chatBadge = newVal;
      }
    });
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState){
      if( toState.name === 'tab.chats' && fromState.name == 'chat-detail') {
       $scope.chatBadge = Notification.wasRemoved() ? ($scope.chatBadge - 1) : $scope.chatBadge;
      }
    });
  })
  .controller('OfflineCtrl', function($scope){

  })

  .controller('DashCtrl', function($scope, Users) {
    function hideLoading(){
      if( Users.hasCurrent() ) {
        $scope.hideLoading = true;
        $scope.currentUser = Users.getCurrentUser();
      }
    }
    $scope.$on('$ionicView.enter', function() {
      hideLoading();
    });
    $scope.$on('event:user:loaded', function(){
      hideLoading();
    })
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
  .controller('MemberDetailCtrl', function($scope, $stateParams, Networks, Users, Camera, Media, $ionicLoading ){
    $scope.currentId = Users.getCurrentId();
    if( typeof $stateParams.memberId !== 'undefined' ) {
      $scope.member = Networks.getMember( $stateParams.memberId );
    } else {
      $scope.member = Users.getCurrentUser();
      $scope.editProfile = function(){
        $scope.editting = true;
        angular.extend( $scope.form, $scope.member.profile);
        $scope.form.email = $scope.member.email;
        $scope.form.avatarImage = $scope.member.avatarImage;
        $scope.addPicture = function(){
          if( navigator.camera ) {
            $ionicLoading.show({
              template: 'Uploading...'
            });
            Camera.getPicture( { object: 'users', container: 'profile' },
              { quality: 50,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                cameraDirection: 1,
                correctOrientation: true,
                encodingType: 0
              }).then( function(res){
                $scope.form.avatarImage = {
                  url: res.url
                };
              $ionicLoading.hide();
              }, function(){
              $ionicLoading.hide();
            });
          }
        };
        $scope.closeAndReset = function(){
          $scope.$emit('modal:destroy');
          $scope.form = {};
        };
        $scope.$emit('provision:modal:register',{
          scope: $scope
        });
      };
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
      console.log('$on observed event chat badge');
      Chats.all().then( function(chats){ $scope.chats = chats; });
    });

    $scope.$on('$ionicView.enter', function(){
      $ionicLoading.show({
        template: 'Loading...'
      });
      Chats.all().then( function(chats){
        $ionicLoading.hide();
        $scope.chats = chats;
      });
    });
    $scope.sendMessage = function( ) {
      if( $scope.chat._id ) {
        Chats.sendMessage( $scope.chat._id, Object.keys( $scope.chat.members ), $scope.chat.newMessage ).then( function(msg) {
          $scope.chat.messages.push( msg );
        });
      } else {
        Chats.startConversation( [$scope.chat.otherMember], $scope.chat.newMessage).then( function(chats){
          $scope.chats = chats;
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

    $scope.provisionChatModal = function(){
      $ionicLoading.show({
        template: 'Loading...'
      });
      $scope.chat = {};
      Users.getAll().then( function(res) {
        $ionicLoading.hide();
        $scope.users = _.indexBy( res.data.users, '_id' );
        delete $scope.users[ $scope.currentId ];
        $scope.$emit('provision:modal:chat', {
          scope: $scope,
          chat: $scope.chat
        });
      });
    }
  })
  .controller('ChatsDetailCtrl', function( $scope, $state, Chats, Users, Notification, $ionicHistory, $rootScope, $ionicActionSheet, $ionicScrollDelegate ) {
    $scope.$on('$ionicView.enter', function() {
      $scope.chat = Chats.getOne($state.params.chatId);
      Notification.ifHasChatRemove( $state.params.chatId );
    });
    $scope.currentId = Users.getCurrentId();
    $scope.$on('event:chat:badge', function(){
      console.log('$on observed event chat badge');
      Chats.all().then( function(chats){
        Notification.ifHasChatRemove( $state.params.chatId );
        // remove notificationt the $scope.chat = ...
        $scope.chat = chats[ $state.params.chatId ];
      });
    });
    //$scope.$watch( function(){ return Notification.getChat(); }, function(newVal){
    //  if( newVal ) {
    //    $scope.chat = Chats.getOne($state.params.chatId);
    //    Notification.resetChat();
    //  }
    //});
    $scope.goBack = function() {
      $ionicHistory.goBack();
      $rootScope.hideTabs = 0;
    };
    $scope.scrollBottom = function(){
      $ionicScrollDelegate.scrollBottom(true);
    };
    $scope.sendMessage = function( ) {
      Chats.sendMessage($scope.chat._id, Object.keys($scope.chat.members), $scope.chat.newMessage).then(function (msg) {
        $scope.chat.messages.splice(0, 0, msg);
        $scope.chat.newMessage = '';
      });
    };
    $scope.menu = function(){
      $ionicActionSheet.show({
        buttons: [
          { text: 'Take Photo or Video' }
        ],
        cancelText: 'Cancel',
        cancel: function() {
          // add cancel code..
        },
        buttonClicked: function() {
          return true;
        }
      });
    };
  })

  .controller('SearchCtrl', function( $scope) {

  })
  .controller('AccountCtrl', function($scope, $state, Users) {
    $scope.currentUser = Users.getCurrentUser();
    $scope.settings = {
      enableFriends: true
    };
    $scope.logout = function(){
      Users.logout();
      $state.go('offline');
    }
  })
  .controller('PaymentCtrl', function($scope, Users, Payments, $ionicPopup, $ionicLoading, stripe){
    $scope.currentUser = Users.getCurrentUser();
    $scope.adFree = true;
    $scope.form = {
      number: '4242424242424242',
      exp: '12/2016',
      cvc: '123'
    };
    $scope.editPayment = function(){
      $scope.currentUser.hasPayment = false;
    };
    $scope.savePayment = function(){
      $ionicLoading.show({
        template: 'Making payment...'
      });
      stripe.card.createToken( $scope.form )
        .then(function (response) {
          console.log('token created for card ending in ', response);
          Payments.startSubscription( {stripeToken: response.id} ).then( function(){
            console.log('successfully submitted payment for $');
            $scope.currentUser.hasPayment = true;
            $ionicLoading.hide();
          }, function(){
            $ionicLoading.hide();
          });
        }, function(err){
          console.log('err: ' + err);
          $ionicLoading.hide();
        });
    };
    $scope.confirmRemoval = function(){
      $ionicPopup.confirm({
        title: 'Payment Removal',
        template: 'Are you sure you want to remove?',
        buttons: [{
          text: 'Cancel'
        },{
          text: 'Remove',
          type: 'button-assertive',
          onTap: function(){
            console.log( 'Removing Item' );
            $scope.form = {};
            $scope.currentUser.hasPayment = false;
          }
        }]
      });
    }
  });
