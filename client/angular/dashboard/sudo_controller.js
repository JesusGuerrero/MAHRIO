angular.module('baseApp.controllers')
  .controller('SudoDashboardController', ['$scope',
    function($scope){
      'use strict';
      /*jshint camelcase: false */
      var months = ['January','February','March','April','May','June','July','August','September','October','Novermber','December'];

      $scope.line_labels = [];
      var today = new Date();
      var thisMonth = today.getMonth();
      for( var x=thisMonth-6; x <= thisMonth; x++) {
        if( x < 0 ) {
          $scope.line_labels.push( months[12+x] );
        } else {
          $scope.line_labels.push( months[x] );
        }
      }
      $scope.line_series = ['Average Online Traffic'];
      $scope.line_data = [
        [65, 59, 80, 81, 56, 55, 90]
      ];
      $scope.onClick = function (points, evt) {
        console.log(points, evt);
      };
      $scope.onHover = function (points) {
        if (points.length > 0) {
          console.log('Point', points[0].value);
        } else {
          console.log('No point');
        }
      };

      $scope.doughnut_labels = ['MongoDB', 'Angular', 'Hapi', 'Raspberry Pi', 'Ionic', 'Oauth'];
      $scope.doughnut_data = [3, 6, 4, 4, 5, 2];

      setTimeout( function(){ $('.box').matchHeight(); }, 10 );
    }]);