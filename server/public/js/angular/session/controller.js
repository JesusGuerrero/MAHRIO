angular.module('baseApp.controllers')
  .controller('SessionController', ['$scope','$stateParams','Session','ValidatorFactory',
    function($scope, $stateParams, Session, validate ){
      'use strict';

      if( $stateParams.token && !$stateParams.user ){
        Session.hasValidToken( {token: $stateParams.token} )
          .then( function(){
            $scope.ready = true;
            $scope.isValidToken = true;
          }, function(){
            $scope.ready = true;
          });
      }
      $scope.user = {};
      $scope.login = function () {
        if ($scope.user.password && $scope.user.email) {
          Session.login( $scope.user )
            .then( function(res){
              $scope.setAuthorizationHeader( res.headers('Authorization') );
              $scope.getProfile(true);
            }, function( err ){
              $scope.validationErrors = [err.data.message];

            });
        }else {
          $scope.validationErrors = ['Please Try Again!'];
        }
      };

      $scope.recoverPassword = function(){
        $scope.submitted = true;

        var validation = {};
        if( validate.forms.recoverPassword( $scope.user, validation ) ){
          $scope.validationErrors = validation.errors;
          return;
        }

        Session.recoverPassword( $scope.user )
          .then( function(){
            delete $scope.submitted;
            $scope.user = {};
            $scope.recoverSuccess = true;
          });
      };
      $scope.passwordReset = function(){
        $scope.submitted = true;

        var validation = {};
        if( validate.forms.passwordReset( $scope.user, validation ) ){
          $scope.validationErrors = validation.errors;
          return;
        }
        Session.passwordReset( {token: $stateParams.token, newPassword: $scope.user.newPassword} )
          .then( function( res ){
            $scope.setAuthorizationHeader( res.headers('Authorization') );
            $scope.getProfile(true);
          }, function(err){
            $scope.validationErrors = err.message;
          });
      };
    }
  ]);