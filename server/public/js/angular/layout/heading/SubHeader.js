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
  .directive('heading', [ '$rootScope','$state',
    function( $rootScope, $state ){
      'use strict';
      return {
        restrict: 'E',
        replace: true,
        templateUrl: '/assets/html/layout/heading/index',
        link: function( scope ) {
          $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            //console.log( event, 2, toState, 3, toParams, 4, fromState, 5, fromParams );
            var head, breadcrumbs = [{url: 'root',value: 'Home'}];
            //switch( toState.name ) {
            //  case 'boards.list':
            //    breadcrumbs.push({url:'', value: 'View Boards'});
            //    head = {title: 'Boards', subTitle: 'Listing all', breadcrumbs: breadcrumbs};
            //    break;
            //  case 'boards.new':
            //    breadcrumbs.push({url:'', value: 'Create Board'});
            //    head = {title: 'Boards', subTitle: 'Create new', breadcrumbs: breadcrumbs};
            //    break;
            //  case 'boards.detail':
            //    breadcrumbs.push({url:'', value: 'Name'});
            //    head = {title: 'Board:', subTitle: 'Name', breadcrumbs: breadcrumbs};
            //    break;
            //  default:
            //    breadcrumbs.push({url:'', value:'Undefined'});
            //    head = {title: 'Undefined', subTitle: 'Undefined', breadcrumbs: breadcrumbs};
            //    break;
            //}
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