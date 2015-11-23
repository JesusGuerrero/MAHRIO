angular.module('starter.controllers', [])
  .controller('AccountCtrl', function($scope, Users) {
    $scope.settings = {
      enableFriends: true
    };

    $scope.currentUser = Users.currentUser;
  })
  .controller('ChatsCtrl', function($scope, Users, Chats, Messages ) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.chat = {};
    $scope.users = Users.getXother();
    $scope.create = function( ) {
      if( $scope.chat.id ) {
        var message = Messages.add( $scope.chat.id, Users.currentUser.id, $scope.chat.newMessage );
        $scope.chat.messages[ message.id ] = message;
      } else {
        console.log( $scope.chat.otherMember );
        var chat = Chats.add( [Users.currentUser.id, $scope.chat.otherMember], [] );
        var msg = Messages.add( chat.id, Users.currentUser.id, $scope.chat.newMessage );
        Chats.updateMessages( chat.id, msg.id );
        Messages.updateChat( msg.id, chat.id );
        $scope.chat = Chats.get( chat.id );
        $scope.chats = Chats.all();
        console.log( $scope.chats );
      }
      $scope.chat.newMessage = '';
    };
    $scope.remove = function(chatId) {
      if( Chats.remove(chatId) ) {
        $scope.chats = Chats.all();
      }
    };
    $scope.provisionChatModal = function( id ){
      if( typeof id !== 'undefined'){
        $scope.chat = Chats.get( id );
      } else {
        $scope.chat = {};
      }
      $scope.$emit('provision:modal:chat', {
        id: id,
        scope: $scope,
        chat: $scope.chat
      });
    };
  })
  .controller('DashCtrl', function($scope) {})
  .controller('HomeCtrl', function($scope, Users, Modal){

    $scope.modal = {};
    $scope.openModal = function(){
      $scope.modal.show();
    };
    $scope.form = {};
    $scope.addObject = function() {
      console.log($scope);
      $scope.modal.hide();
    };
    $scope.$on('modal:destroy', function() {
      for( var key in $scope.modal ) {
        $scope.modal[ key].remove();
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
      eventObject.scope.currentUser = Users.currentUser;
      Modal.provisionModal(eventObject.scope, 'templates/modal-chat.html').then(function(modal){
        $scope.modal = modal;
        $scope.modal.show();
      });
    });
  })
  .controller('NetworksCtrl', function( $scope, Networks) {
    $scope.networks = Networks.get();
  })
  .controller('NetworkDetailCtrl', function( $scope, $stateParams, Networks) {
    $scope.network = Networks.get( $stateParams.networkId );

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
  .controller('OfflineCtrl', function($scope){

  })
  .controller('DemoCtrl', function($scope){

  })
  .controller('WelcomeCtrl', function($scope){

  })
  .controller('ArticlesCtrl', function($scope, $stateParams, Networks ){
    $scope.networkId = $stateParams.network;
    $scope.articles = Networks.get($scope.networkId).articles;
  })
  .controller('ArticleDetailCtrl', function($scope, $stateParams, Articles){
    $scope.article = Articles.get( $stateParams.articleId );
    console.log( $scope.article );
  })
  .controller('BoardsCtrl', function($scope, $stateParams, Networks){
    $scope.networkId = $stateParams.network;
    $scope.boards = Networks.getBoards( $stateParams.network );
  })
  .controller('BoardDetailCtrl', function($scope, $stateParams, Networks){
    $scope.board = Networks.getBoards( $stateParams.network, $stateParams.boardId );
  })
  .controller('EventsCtrl', function($scope, $stateParams, Networks){
    $scope.networkId = $stateParams.network;
    $scope.events = Networks.getEvents( $stateParams.network );
  })
  .controller('EventDetailCtrl', function($scope, $stateParams, Networks){
    $scope.event = Networks.getEvents( $stateParams.network, $stateParams.eventId );
  })
  .controller('HardwareCtrl', function($scope, $stateParams, Networks){
    $scope.networkId = $stateParams.network;
    $scope.harware = Networks.getHardware( $stateParams.network );
  })
  .controller('HardwareDetailCtrl', function($scope, $stateParams, Networks){
    $scope.hardware = Networks.getHardware( $stateParams.network, $stateParams.hardwareId );
  })
  .controller('MembersCtrl', function($scope, $stateParams, Networks){
    $scope.networkId = $stateParams.network;
    $scope.members = Networks.getMembers( $stateParams.network );
  })
  .controller('MembersDetailCtrl', function($scope, $stateParams, Networks){
    $scope.member = Networks.getMembers( $stateParams.network, $stateParams.memberId );
  })
  .controller('SearchCtrl', function( $scope) {

  });
