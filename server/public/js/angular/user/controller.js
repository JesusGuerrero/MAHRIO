/* global confirm */
/* global $ */

angular.module('baseApp.controllers')
  .controller('UsersController', ['$scope','$state','$stateParams', 'User','Admin','ValidatorFactory','_','currentUser',
    function ($scope, $state, $stateParams, User, Admin, validate, _, currentUser) {
      'use strict';

      switch( $state.current.name ) {
        case 'users.new':
          $scope.user = {
            profile: {}
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
                delete $scope.user.email;
                $scope.validationErrors = [err.data.message];
              });
          };
          break;
        case 'users.detail':
          $scope.user = User.get( $state.params.id );
          break;
        case 'users.list':
          var current = currentUser.get();
          $scope.open = 0;
          User.getUsersList()
            .then( function( res ){
              $scope.usersList = _.filter( res.list, function(user){ return user._id !== current._id; });
            });
          $scope.messageModal = function( index ){
            $('#modalNewMessage').modal().toggle();
            $scope.open = $scope.usersList[ index ];
          };
          break;
        default:
          if( $stateParams.token ) {
            User.confirmAccount( {token: $stateParams.token} )
              .then( function(){
                $scope.ready = true;
                $scope.confirmed = true;
              }, function(){
                $scope.ready = true;
              });
          }
          break;
      }

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
                e.access='admin';
                return true;
              }
            });
            $scope.madeAdmin = $scope.email;
            $scope.email = '';
          });
      };



    }
  ]);