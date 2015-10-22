angular.module('baseApp.directives')
  .directive('viewArticleObjectsArray', [ function(){
    'use strict';

    return {
      restrict: 'E',
      templateUrl: '/assets/html/article/viewObjects',
      scope: {
        articles: '=',
        networkId: '=',
        access: '=',
        editArticle: '=',
        remove: '='
      },
      link: function(){

      }
    };
  }]);