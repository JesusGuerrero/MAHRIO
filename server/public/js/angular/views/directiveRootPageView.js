angular.module('baseApp.directives')
  .directive('rootPageView', ['$rootScope','Newsletter',
    function($rootScope, Newsletter){
      'use strict';
      return {
        restrict: 'A',
        templateUrl: function() {
          switch ($rootScope.access) {
            case 'any':
              return '/assets/html/views/home';
            case 'authorized':
              return '/assets/html/dashboard/index';
            case 'admin':
              return '/assets/html/views/dashboard';
          }
        },
        link: function( scope ){
          scope.entry = {};
          scope.newsletterSignup = function(){
            Newsletter.add( scope.entry).then( function(){
              alert('thank you for sign up');
              scope.entry = {};
            });
          };
        }
      };
    }
  ]);