angular.module('baseApp')
  .provider('Res',[ function( ) {

    'use strict';
    this.$get = function () {
      return {
        articles: function( id, Article, defer ) {
          Article.get( id )
            .then( function( res ) {
              if( id ) {
                defer.resolve(res.article);
              } else {
                defer.resolve(res.articles);
              }
            }, function(){
              defer.resolve([]);
            });
          return defer.promise;
        },
        boards: function( id, Board, defer ) {
          Board.get( id )
            .then( function( res ) {
              if( id ) {
                defer.resolve(res.board);
              } else {
                defer.resolve(res.boards);
              }
            }, function(){
              defer.resolve([]);
            });
          return defer.promise;
        },
        chats: function( id, Chat, defer) {
          Chat.get( id )
            .then( function( res ) {
              if( id ) {
                defer.resolve(res.chat);
              } else {
                defer.resolve(res.chats);
              }
            }, function(){
              defer.resolve([]);
            });
          return defer.promise;
        },
        events: function( id, Calendar, defer ) {
          Calendar.get( id )
            .then( function( res ) {
              if( id ) {
                defer.resolve(res.event);
              } else {
                defer.resolve(res.events);
              }
            }, function(){
              defer.resolve([]);
            });
          return defer.promise;
        },
        network: function (id, Network, defer) {
          Network.get(id)
            .then(function (res) {
              if( id ) {
                defer.resolve(res.network);
              } else {
                defer.resolve(res.networks);
              }
            }, function () {
              defer.reject(null);
            });
          return defer.promise;
        },
        users: function (id, User, defer) {
          User.get(id)
            .then(function (res) {
              if( id ) {
                defer.resolve(res.user);
              } else {
                defer.resolve(res.users);
              }
            }, function () {
              defer.reject(null);
            });
          return defer.promise;
        }
      };
    };
  }]);
//
//articles: function($stateParams, Article, $q) {
//  var defer = $q.defer();
//  Article.get( $stateParams.articleId )
//    .then( function( res ) {
//      var article = res.article;
//      if( article.media && article.media.length ) {
//        article.primaryImage = {
//          url: article.media[0].url
//        };
//      }
//      defer.resolve( article );
//    }, function(){
//      defer.resolve( null );
//    });
//  return defer.promise;
//}