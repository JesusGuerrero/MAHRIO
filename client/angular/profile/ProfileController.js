angular.module('baseApp.controllers')
  .controller('ProfileController', ['$scope', '$state', function( $scope, $state ) {
    'use strict';

    $scope.activeState = $state.current.name;
    $scope.tab = [false, false, false, false];
    switch( $state.current.name ) {
      case 'profile':
        $scope.tab[0] = true;
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
        break;
    }

    $scope.tabSelect = function(val){
      $scope.state = val;
    };
  }]);