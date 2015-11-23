angular.module('starter.directives', [])
  .directive('tabbedNavigation', function( $state ) {
    console.log(1);
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
        var user = Users.currentUser;
        console.log( user.networks, scope.id );
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
  .directive('loginButton', function(Users, $state, $ionicSlideBoxDelegate, $ionicPopup, $timeout, $ionicHistory){
    return {
      restrict: 'E',
      replace: true,
      template: '<button class="button button-block" ng-click="loginModal();">Log in</button>',
      scope: {},
      link: function(scope){
        scope.form = {};
        scope.state = 'Log in';
        scope.login = function( ){
          if( scope.form.email && Users.login( scope.form.email) ) {
            $ionicHistory.nextViewOptions({
              disableBack: true
            });
            $state.go('tab.dash');
            scope.$emit('modal:destroy');
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
          })
        };
        scope.closeAndReset = function(){
          scope.$emit('modal:destroy');
          $timeout( function(){
            scope.form = {};
            scope.state = 'Log in';
          }, 200);
        };
        scope.resetPasswordSlide = function(){
          scope.state = 'Reset password';
          $ionicSlideBoxDelegate.next();
        };
        scope.loginSlide = function(){
          scope.state = 'Log in';
          $ionicSlideBoxDelegate.previous();
        };
        scope.loginModal = function(){
          console.log(scope);
          scope.$emit('provision:modal:login',{
            scope: scope
          });
        };
      }
    }
  })
  .directive('registerButton', function(Users, $state, $ionicHistory){
    return {
      restrict: 'E',
      replace: true,
      template: '<a class="button button-block" ng-click="registerModal()">Register</a>',
      scope: {},
      link: function(scope){
        scope.form = {};
        scope.registerModal = function(){
          console.log(scope);
          scope.$emit('provision:modal:register',{
            scope: scope
          });
        };
        scope.register = function(){
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go('tab.dash');
          scope.$emit('modal:destroy');
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
