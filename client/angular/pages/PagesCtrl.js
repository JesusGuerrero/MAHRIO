angular.module('baseApp.controllers')
  .controller('PagesCtrl', ['$scope', '$http', '$state', function($scope, $http){
    'use strict';
    $scope.f = { };
    $scope.contactUs = function(){
      $scope.f.type = 'contact';
      $http.post( '/api/contact', {contact: $scope.f })
        .then( function(){
          $scope.success = 'Thank you! We will be in contact with you soon.';
          $scope.f = {};
        });
    };
    $scope.newsletterSignup = function(){
      $scope.f.type = 'newsletter';
      $http.post( '/api/contact', {contact: $scope.f })
        .then( function(){
          $scope.success = 'Thank you! You have successfully been added.';
          $scope.f = {};
        });
    };
    $scope.askUsQuestion = function(){
      $scope.f.type = 'question';
      $http.post( '/api/contact', {contact: $scope.f })
        .then( function(){
          $scope.success = 'Thank you! Your question will be answered promtly.';
          $scope.f = {};
        });
    };
  }]);