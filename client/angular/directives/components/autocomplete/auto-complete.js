angular.module('baseApp.directives')
  .directive('autoComplete', ['$http',
    function($http){
      'use strict';
      return {
        restrict: 'E',
        templateUrl: '/assets/html/directives/components/autocomplete/auto-complete-input.html',
        link: function(scope){
          scope.to = '';
          scope.getLocation = function(val) {
            return $http.get('/api/autocomplete/users', {
              params: {
                q: val
              }
            }).then(function(response){
              return response.data.results.map(function(item){
                /*jshint camelcase: false */
                return item.formatted_address;
              });
            });
          };
        }
      };
    }
  ]);