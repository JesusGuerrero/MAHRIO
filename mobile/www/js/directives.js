angular.module('starter.directives', [])
  .directive('tabbedNavigation', function( $state ) {
    return {
      restrict: 'A',
      link: function( scope, elem ) {
        scope.$watch( function() { return $state.current; }, function(newVal) {
          if( false && newVal && newVal.name && newVal.name === 'tab.articles' ) {
            elem.addClass('tabbed-nav');
          } else {
            elem.removeClass('tabbed-nav');
          }
        });
      }
    };
  })
  .directive('hideTabs', function($rootScope) {
    return {
      restrict: 'A',
      link: function($scope, $el) {
        $rootScope.hideTabs = true;
        $scope.$on('$destroy', function() {
          $rootScope.hideTabs = false;
        });
      }
    };
  })
  .directive('formInputTag', function(){
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/directives/form-input-tag.html',
        scope: {
          dataEntry: '=model',
          minLength: '=',
          required: '=',
          regex: '=',
          maxLength: '='
        },
        link: function( scope, elem, attr ) {
          scope.placeholder = attr.placeholder || '';
          scope.label = attr.label || false;
          scope.id = attr.id || new Date().getTime();
          scope.type = attr.type || 'text';
          scope.icon = attr.icon || '';

          scope.regx = typeof scope.regex !== 'undefined' ? scope.regex : { pattern: new RegExp('') };

          scope.hasError = function() {
            return scope.$parent.submitted && elem.hasClass( 'ng-invalid' );
          };
        }
      };
  })
  .directive('buttonSecondary', function(Networks, Users){
    return {
      restrict: 'E',
      scope: {
        on: '@',
        off: '@',
        icon: '@',
        id: '@',
        type: '@',
        confirm: '=click'
      },
      templateUrl: 'templates/directives/button-secondary.html',
      link: function(scope){
        var user = Users.getCurrent();
        if( user.networks.indexOf( scope.id ) ) {
          scope.text = scope.off;
        } else {
          scope.text = scope.on;
        }
        scope.styleType = function(){
          switch( scope.type ) {
            case "1":
              return {
                fontSize: '12px',
                position: 'absolute',
                bottom: '20px',
                minHeight: '20px',
                lineHeight: '26px'
              };
          }
        };
        scope.join = function(){
          Networks.join( scope.network );
          Users.addNetwork( scope.network );
        };
        scope.confirmClick = function(){
          if( typeof scope.confirm === 'function' ) {
            scope.confirm();
          }
        }
      }
    }
  })
  .directive('loginButton', function(Users, Notification, $state, $ionicSlideBoxDelegate, $ionicPopup, $timeout, $ionicHistory){
    return {
      restrict: 'E',
      replace: true,
      template: '<button class="button button-block" ng-click="loginModal();">Log in</button>',
      scope: {},
      link: function(scope){
        scope.form = {};
        scope.state = 'Log in';
        scope.login = function( ){
          if( scope.form.email ) {
            Users.login( scope.form )
              .then( function(){
                $ionicHistory.nextViewOptions({
                  disableBack: true
                });
                Notification.fetchAll().then( function(){
                  $state.go('tab.dash');
                  scope.$emit('modal:destroy');
                });
              }, function(){
                $ionicPopup.alert({
                  title: 'Login Error',
                  template: 'Email and/or Password incorrect. Try again!'
                }).then( function(){
                  scope.form = {};
                });
              })
          } else {
            $ionicPopup.alert({
              title: 'Login Error',
              template: 'Email and/or Password incorrect. Try again!'
            }).then( function(){
              scope.form = {};
            });
          }
        };
        scope.resetPassword = function(){
          $ionicPopup.alert({
            title: 'Password Reset Success',
            template: 'Now check your email for further instructions.'
          }).then( function(){
            scope.$emit('modal:destroy');
            $timeout( function(){
              scope.form = {};
              scope.state = 'Log in';
            }, 200);
          });
        };
        scope.closeAndReset = function(){
          scope.$emit('modal:destroy');
          $timeout( function(){
            scope.form = {};
            scope.state = 'Log in';
          }, 200);
        };
        scope.resetPasswordSlide = function(){
          scope.form = {};
          scope.state = 'Reset password';
          $ionicSlideBoxDelegate.next();
        };
        scope.loginSlide = function(){
          scope.form = {};
          scope.state = 'Log in';
          $ionicSlideBoxDelegate.previous();
        };
        scope.loginModal = function(){
          scope.$emit('provision:modal:login',{
            scope: scope
          });
        };
      }
    }
  })
  .directive('registerButton', function(Users, $state, $ionicHistory, $ionicPopup){
    return {
      restrict: 'E',
      replace: true,
      template: '<a class="button button-block" ng-click="registerModal()">Register</a>',
      scope: {},
      link: function(scope){
        scope.form = {};
        scope.registerModal = function(){
          scope.$emit('provision:modal:register',{
            scope: scope
          });
        };
        scope.register = function(){
          if( Users.register( scope.form ) ) {
            $ionicHistory.nextViewOptions({
              disableBack: true
            });
            $state.go('tab.dash');
            scope.$emit('modal:destroy');
          } else {
            $ionicPopup.alert({
              title: 'Registration Error',
              template: 'Email exists.'
            });
          }

        };
        scope.closeAndReset = function(){
          scope.$emit('modal:destroy');
          scope.form = {};
        };
      }
    }
  })
  .directive('demoButton', function(Users, $state, $ionicHistory, $ionicSlideBoxDelegate){
    return {
      restrict: 'E',
      replace: true,
      template: '<a class="button button-block" ng-click="demoModal()">Demo</a>',
      scope: {},
      link: function(scope){
        scope.state = 0;
        scope.demoModal = function(){
          scope.state = 0;
          scope.$emit('provision:modal:demo',{
            scope: scope
          });
        };
        scope.previous = function(){
          scope.state--;
          $ionicSlideBoxDelegate.previous();
        };
        scope.next = function(){
          scope.state++;
          $ionicSlideBoxDelegate.next();
        };
        scope.slideHasChanged = function( index ) {
          scope.state = index;
        };
      }
    }
  });
