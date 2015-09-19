angular.module('baseApp.directives')
  .directive('rootPageView', ['$rootScope','Newsletter',
    function($rootScope, Newsletter){
      'use strict';
      return {
        restrict: 'A',
        templateUrl: function() {
          switch ($rootScope.access) {
            case 'any':
              return '/assets/html/pages/home';
            case 'authorized':
              return '/assets/html/dashboard/authorized_view';
            case 'admin':
              return '/assets/html/dashboard/admin_view';
            case 'sudo':
              return '/assets/html/dashboard/sudo_view';
          }
        },
        link: function( scope ){
          scope.entry = {};
          scope.newsletterSignup = function(){
            Newsletter.add( scope.entry).then( function(){
              //alert('thank you for sign up');
              scope.entry = {};
            });
          };
        }
      };
    }
  ]);