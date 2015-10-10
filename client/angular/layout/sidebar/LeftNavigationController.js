angular.module('baseApp.controllers')
  .controller('LeftNavigationController', ['$scope','currentUser','$state',
    function ($scope, currentUser, $state ) {
      'use strict';

      $scope.user = currentUser.get();

      $scope.$watch( function(){
        return $state.current.name;
      }, function(newVal) {
        if( newVal ) {
          $scope.state = newVal.split('.')[0];
        }
      });

      $scope.$watch( function(){
        return currentUser.currentNetwork;
      }, function(newVal) {
        if( newVal ) {
          $scope.currentNetwork = newVal;
        } else {
          $scope.currentNetwork = null;
        }
      });
    }
  ]);