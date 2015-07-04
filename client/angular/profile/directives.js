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
  .directive( 'profileInfo', ['currentUser', '_', 'FeedbackService',  function( currentUser, _, FeedbackService) {
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
          currentUser.update(_.extendOwn( {firstName: '', lastName: ''}, scope.user) )
            .then( function(res) {
              currentUser.set( _.extendOwn( currentUser.get(), res.user ) );
              FeedbackService.set({feedbackSuccess: 'Profile Updated!'});
            }, function(){
              FeedbackService.set({validationErrors: ['Error Updating']});
            });
        };
      }
    };
  }])
  .directive( 'profileContact', ['currentUser', 'FeedbackService', function( currentUser, FeedbackService) {
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
              FeedbackService.set({feedbackSuccess: 'Email Updated!'});
            }, function(){
              _init();
              FeedbackService.set({validationErrors: ['Error Updating']});
            });
        };
      }
    };
  }])
  .directive( 'profileSecurity', ['currentUser', 'FeedbackService', function( currentUser, FeedbackService ) {
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
              _init();
              FeedbackService.set({feedbackSuccess: 'Password Updated!'});
            }, function(){
              _init();
              FeedbackService.set({validationErrors: ['Error Updating']});
            });
        };
      }
    };
  }]);