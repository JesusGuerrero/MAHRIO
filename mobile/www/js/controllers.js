angular.module('starter.controllers', [])

  .controller('HomeCtrl', function($scope, Users, Modal){

    $scope.openModal = function(){
      $scope.modal.show();
    };
    $scope.form = {};
    $scope.addObject = function() {
      console.log($scope);
      $scope.modal.hide();
    };
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
      $scope.$broadcast('event:done');
    });

    $scope.$on('provision:modal:signin', function(){
      Modal.provisionModal($scope, 'templates/modal.html').then(function(modal){
        $scope.modal = modal;
        $scope.modal.show();
        console.log('IN MODAL');
      });
      console.log('PROVISIONED MODAL');
    });
    $scope.$on('provision:modal:chat', function( event, eventObject ){
      eventObject.scope.currentUser = Users.currentUser;
      Modal.provisionModal(eventObject.scope, 'templates/modal-chat.html').then(function(modal){
        $scope.modal = modal;
        $scope.modal.show();
        console.log( eventObject );
        console.log('IN MODAL', eventObject.scope );
      });
      console.log('PROVISIONED CHAT ' + eventObject.id + ' MODAL', eventObject.scope);
    });
  })
  .controller('DashCtrl', function($scope) {})

  .controller('NetworksCtrl', function( $scope, Networks) {
    //$http({
    //  method: 'GET',
    //  url: APP_IP + '/api/networks'
    //}).then( function(){
    //
    //}, function(){
    //
    //});
    $scope.networks = Networks.all();
  })
  .controller('NetworkDetailCtrl', function( $scope, $stateParams, Networks) {
    $scope.network = Networks.get($stateParams.networkId);
  })
  .controller('ArticlesCtrl', function($scope, $stateParams, Networks){
    $scope.networkId = $stateParams.network;
    $scope.articles = Networks.getArticles( $stateParams.network );
    console.log( $scope.articles );
  })
  .controller('ArticleDetailCtrl', function($scope, $stateParams, Networks){
    $scope.article = Networks.getArticles( $stateParams.network, $stateParams.articleId );
  })
  .controller('BoardsCtrl', function($scope, $stateParams, Networks){
    $scope.networkId = $stateParams.network;
    $scope.boards = Networks.getBoards( $stateParams.network );
  })
  .controller('BoardDetailCtrl', function($scope, $stateParams, Networks){
    $scope.board = Networks.getBoards( $stateParams.network, $stateParams.articleId );
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
    $scope.$on('event:done', function(){
      console.log('INNNNNNN')
    });
  })
  //.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  //  $scope.chat = Chats.get($stateParams.chatId);
  //})
  .controller('SearchCtrl', function( $scope) {

  })

  .controller('AccountCtrl', function($scope) {
    $scope.settings = {
      enableFriends: true
    };
    $scope.provisionSignInModal = function(){
      $scope.$emit('provision:modal:signin');
    };
  });
