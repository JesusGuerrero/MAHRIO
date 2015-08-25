angular.module('baseApp.controllers')
  .controller('KnowledgeController', ['$scope',
    function($scope) {
      'use strict';

      $scope.domains = [
        'Finance',
        'Computer Science'
      ];
    }
  ]
);