angular.module('baseApp.controllers')
  .controller('SubHeaderController', ['$scope','SubHeader',
    function($scope, SubHeader) {
      'use strict';

      var skip1 = false;
      $scope.$watch( SubHeader.get, function(n){

        if( !skip1 ){
          skip1 = true;
          return;
        }
        $scope.subHeader.breadcrumbs = n;
      });
      $scope.subHeader = SubHeader.get();
    }
  ]
);

angular.module('baseApp.directives')
  .directive('heading', [ '$rootScope','$state', 'currentUser',
    function( $rootScope, $state, currentUser ){
      'use strict';
      return {
        restrict: 'E',
        replace: true,
        templateUrl: '/assets/html/layout/heading/index',
        link: function( scope ) {
          $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState ) {

            if( /networks\.detail/.test( fromState.name ) || !fromState.name   ) {
              currentUser.currentNetwork = null;
            }
            scope.heading = {
              title: toState.title,
              subTitle: toState.subTitle,
              breadcrumbs: [
                {
                  url: 'root',
                  value: 'Home'},
                {
                  url: 'root',
                  value: toState.title
                }
              ]
            };
          });
          scope.heading = {
            title: $state.current.title,
            subTitle: $state.current.subTitle,
            breadcrumbs: [
              {
                url: 'root',
                value: 'Home'
              },
              {
                url: 'root',
                value: $state.current.title
              }
            ]
          };
        }
      };
    }
  ]);