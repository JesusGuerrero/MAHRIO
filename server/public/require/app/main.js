/* global define */

define(['jquery'], function($){
  'use strict';

  function videoBG(){
    $('body').videoBG({
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

  return {
    init: function(){
      switch( window.location.pathname ) {
        case '/':
          videoBG();
          require(['app/pages/home']);
          break;
        case '/questions':
          videoBG();
          require(['app/pages/questions']);
          break;
      }
    }
  };
});