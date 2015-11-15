angular.module('starter.controllers', [])

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

  .controller('ChatsCtrl', function($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
      Chats.remove(chat);
    };
  })
  .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })
  .controller('SearchCtrl', function( $scope) {

  })

  .controller('AccountCtrl', function($scope) {
    $scope.settings = {
      enableFriends: true
    }
  });
