angular.module('baseApp.controllers')
  .controller('ProfileController', ['$scope', '$state', 'currentUser', function( $scope, $state, currentUser ) {
    'use strict';

    $scope.activeState = $state.current.name;
    $scope.tab = [false, false, false, false];
    switch( $state.current.name ) {
      case 'profile':
        $scope.tab[0] = true;
        $scope.myProfile = true;
        break;
      case 'profile.info':
        $scope.tab[1] = true;
        break;
      case 'profile.contact':
        $scope.tab[2] = true;
        break;
      case 'profile.security':
        $scope.tab[3] = true;
        break;
      default:
        $scope.tab[0] = true;
        $scope.currentUser = currentUser.get();
        $scope.$parent.user.then( function( res ) {
          $scope.current = res.user;
        });
        break;
    }

    $scope.tabSelect = function(val){
      $scope.state = val;
    };
  }]);