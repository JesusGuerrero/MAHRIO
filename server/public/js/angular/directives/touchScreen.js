angular.module('baseApp.directives')
  .directive('hideOnTouchScreen', [ function(){
    'use strict';
    return {
      link: function(scope, elem, attr){
        /* global window */
        var emulateMobile = window.location.search.split('&')[1] === 'mobile=true';
        if ('touchstart' in document.documentElement || emulateMobile || window.navigator.msPointerEnabled) {
          if( attr.hideOnTouchScreen === 'true' ){
            $(elem).hide();
          }
          if( attr.addClass ) {
            $(elem).addClass( attr.addClass );
          }
          if( attr.removeClass ) {
            $(elem).removeClass( attr.removeClass );
          }
        }
      }
    };
  }]);