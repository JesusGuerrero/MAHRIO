angular.module('baseApp.directives')
  .directive('modalArticleForm', [ 'Article','FormHelper', '_', function(Article, FormHelper, _){
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

          FormHelper.setupArticleForm( scope );
          FormHelper.setupFormHelper( scope, 'article', Article );
        };

        scope.$watch( function(){ return scope.edit; }, function(newVal){
          if( newVal ) {
            scope.article = newVal;
          } else {
            scope.article = {
              sections: [],
              widgets: [],
              network: scope.networkId
            };
          }
        });
        scope.save = function(){
          if( scope.article._id ) {
            Article.update( scope.article )
              .then( function(){
                scope.$emit('closeModal');
              });
          } else {
            _.forEach( scope.article.sections, function(sec, key) {
              sec.order = key;
            });
            Article.add( scope.article )
              .then( function(){
                scope.$emit('closeModal');
              });
          }
        };
        formSetup();

      }
    };
  }]);