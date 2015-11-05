angular.module('baseApp.filters', [])
  .filter('rawhtml', ['$sce', function($sce){
    'use strict';
    return function(val) {
      return $sce.trustAsHtml(val);
    };
  }]);