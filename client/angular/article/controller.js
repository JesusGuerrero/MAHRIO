angular.module('baseApp.controllers')
  .controller('ArticleController', ['$scope', '$state', '$http', 'currentUser', 'Article', '_',
    function($scope, $state, $http, currentUser, Article, _){
      'use strict';

      $scope.articles = [];
      var formSetup = function(){
        $scope.sortableOptions = { disabled: true };

        $scope.addSection = function( section ){
          $scope.article.sections.push( {body: section} );
        };
        $scope.editSection = function( index ) {
          $scope.article.sections[ index].edit = true;
        };
        $scope.saveSection = function( index ) {
          delete $scope.article.sections[ index].edit;
        };
        $scope.sortSections = function( ){
          $scope.sortableOptions = {
            disabled: false,
            stop: function(e, ui) {
              var logEntry = {
                Text: ui.item.scope().section.body,
                E: e
              };
              //console.log(logEntry);
              //console.log( $scope.article.sections );
            }
          };
          $scope.sortingSections = true;
        };
        $scope.stopSorting = function(){
          $scope.sortableOptions = {
            disabled: true
          };
          $scope.sortingSections = false;
        };
        $scope.removeSection = function( index ) {
          $scope.article.sections.splice( index, 1);
        };
        $scope.addWidget = function( widget ){
          $scope.article.widgets.push( widget );
        };
        $scope.editWidget = function( index ) {
          $scope.article.widgets[ index].edit = true;
        };
        $scope.saveWidget = function( index ){
          delete $scope.article.widgets[ index].edit;
        };
        $scope.removeWidget = function( index ) {
          $scope.article.widgets.splice( index, 1);
        };
      };
      switch( $state.current.name ) {
        case 'articles.new':
          $scope.article = {
            sections: [],
            widgets: []
          };
          $scope.add = function(){
            _.forEach( $scope.article.sections, function(sec, key) {
              sec.order = key;
            });
            Article.add( $scope.article )
              .then( function(){
                $state.go('articles.list',{}, { reload: true });
              });
          };
          formSetup();
          break;
        case 'articles.detail':
          Article.get( $state.params.id )
            .then( function(res) {
              $scope.article = res.article;
            });
          break;
        case 'articles.list':
          Article.get()
            .then( function( res ) {
              $scope.articles = res.articles;
            });
          break;
        case 'articles.edit':
          Article.get( $state.params.id )
            .then( function( res ) {
              $scope.article = res.article;
            });
          formSetup();
          $scope.update = function( ) {
            Article.update( $scope.article )
              .then( function(){
                $state.go('articles.list');
              });
          };
          break;
        default:
          break;
      }

      $scope.remove = function( id ){
        Article.remove( id )
          .then( function(){
            $scope.articles = _.filter( $scope.articles, function(article){ return article._id !== id; });
            $state.go('articles.list');
          });
      };
    }]);