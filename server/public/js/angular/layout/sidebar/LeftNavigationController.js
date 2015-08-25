angular.module('baseApp.controllers')
  .controller('LeftNavigationController', ['$scope','currentUser',
    function ($scope, currentUser) {
      'use strict';

      $scope.user = currentUser.get();
    }
  ]);