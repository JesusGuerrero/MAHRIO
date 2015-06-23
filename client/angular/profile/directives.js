angular.module('baseApp.directives')
  .directive( 'profileSummary', ['currentUser', function( currentUser) {
    'use strict';
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/assets/html/profile/directive-summary',
      link: function(scope) {
        scope.current = currentUser.get();
        console.log( scope.current );
      }
    };
  }])
  .directive( 'profileInfo', ['currentUser', function( currentUser) {
    'use strict';
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/assets/html/profile/directive-info',
      scope: {},
      link: function(scope) {
        var user = currentUser.get();
        scope.user = {
          firstName: user.firstName,
          lastName: user.lastName
        };
        scope.update = function() {
          currentUser.update( scope.user )
            .then( function() {
              window.alert('updated!');
            }, function(){
              window.alert('failed!');
            });
        };
      }
    };
  }])
  .directive( 'profileContact', ['currentUser', function( currentUser) {
    'use strict';
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/assets/html/profile/directive-contact',
      scope: {
        state: '='
      },
      link: function(scope) {
        function _init() {
          scope.user = {
            email: '',
            currentPassword: ''
          };
        }

        scope.$watch( 'state', function(){
          _init();
        });

        scope.update = function() {
          currentUser.update( scope.user )
            .then( function() {
              _init();
              window.alert('updated!');
            }, function(){
              window.alert('failed!');
            });
        };
      }
    };
  }])
  .directive( 'profileSecurity', ['currentUser', function( currentUser ) {
    'use strict';
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/assets/html/profile/directive-security',
      scope: {
        state: '='
      },
      link: function(scope) {
        function _init() {
          scope.user = {
            currentPassword: '',
            password: '',
            confirmPassword: ''
          };
        }

        scope.$watch( 'state', function(){
          _init();
        });

        scope.update = function(){
          if( scope.user.password !== scope.user.confirmPassword ) {
            scope.validationErrors = ['Passwords do not match.'];
          }

          currentUser.update( scope.user )
            .then( function() {
              window.alert('updated!');
              _init();
            }, function(){
              window.alert('failed!');
            });
        };
      }
    };
  }]);