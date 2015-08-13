angular.module('baseApp.directives')
  .directive( 'profileSummary', ['currentUser', function( currentUser) {
    'use strict';
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/assets/html/profile/directive-summary',
      link: function(scope) {
        scope.current = currentUser.get();
      }
    };
  }])
  .directive( 'profileInfo', ['currentUser', '_', 'FeedbackService', 'Media', 'User', '$q', '$http',
    function( currentUser, _, FeedbackService, Media, User, $q, $http) {
      'use strict';
      return {
        restrict: 'E',
        replace: true,
        templateUrl: '/assets/html/profile/directive-info',
        scope: {},
        link: function(scope) {
          var user = currentUser.get();
          if( user.profile ) {
            scope.user = {
              first_name: user.profile.first_name,
              last_name: user.profile.last_name,
              avatarImage: user.avatarImage
            };
          } else {
            scope.user = {};
          }

          scope.update = function() {
            currentUser.update( _.extendOwn( {first_name: '', last_name: ''}, scope.user) )
              .then( function(res) {
                currentUser.get().profile = _.extendOwn( currentUser.get().profile, res.profile );
                FeedbackService.set({feedbackSuccess: 'Profile Updated!'});
              }, function(){
                FeedbackService.set({validationErrors: ['Error Updating']});
              });
          };
          scope.avatarActions = {
            upload: function( mediaDetails, file ){
              var defer = $q.defer();
              mediaDetails.object = 'users';
              Media.getKey( mediaDetails )
                .then( function(res) {
                  $http({
                    url: res.signed_request,
                    method: 'PUT',
                    data: file,
                    transformRequest: angular.identity,
                    headers: { 'x-amz-acl': 'public-read', 'Authorization': undefined, 'Content-Type': undefined }
                  }).then( function(){
                    delete mediaDetails.id;
                    delete mediaDetails.object;
                    mediaDetails.url = res.url;
                    User.addAvatar( mediaDetails )
                      .then( function(){
                        currentUser.get().avatarImage = {
                          url: res.url
                        };
                        defer.resolve({url: res.url});
                      }, function(){
                        defer.reject();
                      });
                  }, function(){
                    defer.reject();
                  })
                }, function(){
                  defer.reject();
                });
              return defer.promise;
            },
            send: function( task ){
              task.description = $('#wysihtml5-content').val();
              return Task.create( task );
            }
          };
        }
      };
    }
  ])
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