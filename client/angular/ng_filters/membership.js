angular.module('baseApp.filters', [])
  .filter('membership', ['currentUser', function(currentUser){
    'use strict';
    return function(val) {
      return val.members[ currentUser.get()._id ];
    };
  }]);