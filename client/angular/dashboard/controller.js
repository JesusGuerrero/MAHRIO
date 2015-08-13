angular.module('baseApp.controllers')
  .controller('DashboardController', ['$scope','$timeout',
    function($scope, $timeout){
      'use strict';
      //alert(10);
      $scope.line_labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
      $scope.line_series = ['Average Online Traffic'];
      $scope.line_data = [
        [10065, 10059, 10080, 10081, 10056, 10055, 10040]
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

      $scope.doughnut_labels = ["Chrome", "IE", "FireFox", "Safari", "Opera"];
      $scope.doughnut_data = [300, 50, 100, 75, 40];


    }]);