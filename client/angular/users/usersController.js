/* global confirm */
/* global $ */

angular.module('baseApp.controllers')
  .controller('UsersController', ['$scope','User','Admin',
    function ($scope, User, Admin) {
      'use strict';

      $scope.usersList = [];
      User.getUsersList()
        .then( function( res ){
          $scope.usersList = res.list;
        });

      $scope.removeEntry = function( id, index ){
        if ( confirm('Are you sure you want to delete?') ) {
          Admin.deleteUserEntry(id)
            .then(function () {
              $scope.usersList.splice(index, 1);
            });
        }
      };

      $scope.makeAdmin = function(){
        User.makeAdmin( $scope.email )
          .then( function(){
            $.grep( $scope.usersList, function(e){
              if( e.email === $scope.email ){
                e.role='admin';
                return true;
              }
            });
            $scope.madeAdmin = $scope.email;
            $scope.email = '';
          });
      };

      $scope.user = 'TEST';
      $scope.setUser = function( index ){
        console.log('in here', index);
        $scope.user = $scope.usersList[index];
        console.log('in here', index, $scope.user );

      };
    }
  ]);