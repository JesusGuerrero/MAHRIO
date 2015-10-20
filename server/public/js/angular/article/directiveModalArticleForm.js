angular.module('baseApp.directives')
  .directive('modalArticleForm', [ '$state', 'Article','FormHelper', '_', function($state, Article, FormHelper, _){
    'use strict';

    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/assets/html/article/form',
      scope: {
        networkId: '=',
        edit: '='
      },
      link: function( scope ){

        var formSetup = function(){
          scope.sortableOptions = { disabled: true };

          scope.addSection = function( section ){
            scope.article.sections.push( {body: section} );
          };
          scope.editSection = function( index ) {
            scope.article.sections[ index].edit = true;
          };
          scope.saveSection = function( index ) {
            delete scope.article.sections[ index].edit;
          };
          scope.sortSections = function( ){
            scope.sortableOptions = {
              disabled: false
            };
            scope.sortingSections = true;
          };
          scope.stopSorting = function(){
            scope.sortableOptions = {
              disabled: true
            };
            scope.sortingSections = false;
          };
          scope.removeSection = function( index ) {
            scope.article.sections.splice( index, 1);
          };
          scope.addWidget = function( widget ){
            scope.article.widgets.push( widget );
          };
          scope.editWidget = function( index ) {
            scope.article.widgets[ index].edit = true;
          };
          scope.saveWidget = function( index ){
            delete scope.article.widgets[ index].edit;
          };
          scope.removeWidget = function( index ) {
            scope.article.widgets.splice( index, 1);
          };
          FormHelper.setupFormHelper( scope, 'article', Article );
        };
        scope.article = {
          sections: [],
          widgets: [],
          network: scope.networkId
        };
        scope.$watch( function(){ return scope.edit; }, function(newVal){
          if( newVal ) {
            console.log( newVal );
            scope.article = newVal;
          }
        });
        scope.save = function(){
          _.forEach( scope.article.sections, function(sec, key) {
            sec.order = key;
          });
          Article.add( scope.article )
            .then( function(){
              scope.$emit('closeModal');
              $state.reload();
            });
        };
        formSetup();

      }
    };
  }]);