/* global confirm */

angular.module('baseApp.controllers')
  .controller('QuestionsController', ['$scope','Admin',
    function ($scope, Admin) {
      'use strict';

      $scope.questionsList = [];
      Admin.getQuestionList()
        .then( function( res ){
          $scope.questionsList = res.list;
        });

      $scope.removeEntry = function( id, index ){
        if ( confirm('Are you sure you want to delete?') ) {
          Admin.deleteQuestionEntry(id)
            .then(function () {
              $scope.questionsList.splice(index, 1);
            });
        }
      };
    }
  ]);