angular.module('otherArticles', [])
  .controller('OtherArticlesController', ['$scope', '$http',
    function($scope, $http){
      $http.get( '/api/articles')
        .then( function(res){
          $scope.otherArticles = res.data.articles;
        }, function(){

        });
    }]);