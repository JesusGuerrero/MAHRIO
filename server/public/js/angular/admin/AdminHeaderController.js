'use strict';

angular.module('baseApp.controllers')
  .controller('AdminHeaderController', ['$scope', 'Admin',
    function ($scope, Admin) {

      $scope.getSessionToCMS = function(){
        Admin.getSessionToCMS()
          .then( function(){
            window.location.href = '/admin/cms';
          });
      };
    }]);
