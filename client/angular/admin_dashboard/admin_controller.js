angular.module('baseApp.controllers')
  .controller('AdminDashboardController', ['$scope','currentUser',
    function($scope, currentUser){
      'use strict';

      $scope.networks = currentUser.get().networks;
    }]);