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
          scope.$watch( function(){
            return currentUser.currentNetworkName;
          }, function(newVal){

            if( newVal ) {
              console.log('i ');
              scope.heading.title = newVal;
            }
          });
          $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState ) {
            if( toState.name === fromState.name ) {
              return;
            }

            //currentUser.currentNetwork
            //if( toState.name === 'networks.list' || !/networks/.test( toState.name )  ) {
            //  currentUser.currentNetwork = null;
            //  currentUser.currentNetworkName = '';
            //}
            //if( /networks/.test( toState.name )  ) {
            //  toState.title = currentUser.currentNetworkName;
            //}
            console.log( fromState );
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
          if( typeof $state.current.title === 'undefined' ) {
            var listener = scope.$watch( function(){
              return $state.current.title;
            }, function(newVal){
              if( newVal ) {
                scope.heading.title = newVal;
                listener();
              }
            });
          }

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