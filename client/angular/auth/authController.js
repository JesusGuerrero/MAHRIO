angular.module('baseApp.controllers')
  .controller('authController', ['$scope','$stateParams', 'User', 'currentUser', 'ValidatorFactory',
    function ($scope, $stateParams, User, currentUser, validate) {
      'use strict';

      if( $stateParams.token && !$stateParams.user ){
        User.hasValidToken( {token: $stateParams.token} )
          .then( function(){
            $scope.ready = true;
            $scope.isValidToken = true;
          }, function(){
            $scope.ready = true;
          });
      }else if( $stateParams.token ) {
        User.confirmAccount( {token: $stateParams.token} )
          .then( function(){
            $scope.ready = true;
            $scope.confirmed = true;
          }, function(){
            $scope.ready = true;
          });
      }
      $scope.user = {};
      $scope.login = function () {
        if ($scope.user.password && $scope.user.email) {
          User.login( $scope.user )
            .then( function(res){
              $scope.setAuthorizationHeader( res.headers('Authorization') );
              $scope.getProfile(true);
            }, function( err ){
              $scope.validationErrors = [err.data.message];

            });
        }else{
          $scope.validationErrors = ['Please Try Again!'];
        }
      };

      $scope.$watch( function(){ return $scope.user.password; }, function(nw){
        if( typeof nw === 'undefined'){
          validate.confirmPass.pattern = /.+/i;
        }else{
          validate.confirmPass.pattern = new RegExp( '^'+nw+'$');
        }
      });

      $scope.register = function () {
        $scope.submitted = true;

        var validation = {};
        if( validate.forms.register( $scope.user, validation ) ){
          $scope.validationErrors = validation.errors;
          return;
        }

        User.register( $scope.user )
          .then( function( res ){
            $scope.setAuthorizationHeader( res.headers('Authorization') );
            currentUser.login(res.user, true);
          }, function( err ){
            $scope.validationErrors = err.message;
          });
      };

      $scope.recoverPassword = function(){
        $scope.submitted = true;

        var validation = {};
        if( validate.forms.recoverPassword( $scope.user, validation ) ){
          $scope.validationErrors = validation.errors;
          return;
        }

        User.recoverPassword( $scope.user )
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
        User.passwordReset( {token: $stateParams.token, newPassword: $scope.user.newPassword} )
          .then( function( res ){
            $scope.setAuthorizationHeader( res.headers('Authorization') );
            currentUser.login(res.user, true);
          }, function(err){
            $scope.validationErrors = err.message;
          });
      };
    }
  ]);

