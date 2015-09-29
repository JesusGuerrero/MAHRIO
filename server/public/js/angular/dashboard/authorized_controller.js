angular.module('baseApp.controllers')
  .controller('AuthorizedDashboardController', ['$scope','currentUser',
    function($scope, currentUser){
      'use strict';

      $scope.networks = currentUser.get().networks;
      console.log( $scope.networks );
    }]);