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