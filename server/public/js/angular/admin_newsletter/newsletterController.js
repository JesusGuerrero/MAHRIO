/* global confirm */

angular.module('baseApp.controllers')
  .controller('adminNewslettersController', ['$scope','Admin',
    function ($scope, Admin) {
      'use strict';

      $scope.newsletterList = [];
      Admin.getNewsletterList()
        .then( function( res ){
          $scope.newsletterList = res.list;
        });

      $scope.removeEntry = function( id, index ){
        if ( confirm('Are you sure you want to delete?') ) {
          Admin.deleteNewsletterEntry(id)
            .then(function () {
              $scope.newsletterList.splice(index, 1);
            });
        }
      };
    }
  ]);