angular.module('starter.directives', [])
  .directive('tabbedNavigation', function( $state ) {
    console.log(1);
    return {
      restrict: 'A',
      link: function( scope, elem ) {
        scope.$watch( function() { return $state.current; }, function(newVal) {
          if( false && newVal && newVal.name && newVal.name === 'tab.networks' ) {
            elem.addClass('tabbed-nav');
          } else {
            elem.removeClass('tabbed-nav');
          }
        });
      }
    };
  });
