angular.module('baseApp')
  .provider('Res',['_', function( _ ) {

    'use strict';
    this.$get = function () {
      return {
        network: function (id, Network, defer) {
          Network.get(id)
            .then(function (res) {
              if( typeof id !== 'undefined' ) {
                defer.resolve(res.network);
              } else {
                defer.resolve(res.networks);
              }
            }, function () {
              defer.reject(null);
            });
          return defer.promise;
        },
        chats: function( id, Chat, defer) {
          console.log( id, Chat, defer );
        },
        articles: function( id, Article, defer ) {
          Article.get()
            .then( function( res ) {
              var articles = res.articles;
              articles = _.indexBy( articles, '_id' );
              _.each( articles, function(item){
                if( item.media && item.media.length ) {
                  item.primaryImage = {
                    url: item.media[0].url
                  };
                }
              });

              defer.resolve( articles );
            }, function(){
              defer.resolve([]);
            });
          return defer.promise;
        }
      };
    };
  }]);