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
        id: '@'
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
        scope.join = function(){
          Networks.join( scope.network );
          Users.addNetwork( scope.network );
        }
      }
    }
  });
