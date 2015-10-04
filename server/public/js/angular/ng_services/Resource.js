angular.module('baseApp')
  .provider('Res',[function() {

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
        }
      };
    };
  }]);