angular.module('baseApp.directives')
  .directive( 'renderVideoBg', [ function(){
    'use strict';

    return {
      restrict: 'A',
      link: function( scope, elem ) {
        elem.videoBG({
          position:'fixed',
          zIndex:0,
          mp4:'/assets/video/video.mp4',
          ogv:'assets/video/video.ogv',
          webm:'assets/video/video.webm',
          poster:'assets/video/video.jpg',
          opacity:1,
          fullscreen:true
        });
      }
    };
  }]);