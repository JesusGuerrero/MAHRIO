angular.module('baseApp.directives')
  .directive('viewArticlesList', [ function(){
    'use strict';

    return {
      restrict: 'E',
      templateUrl: '/assets/html/article/viewList',
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