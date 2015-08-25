angular.module('baseApp.directives')
  .directive('popover', ['$rootScope',
    function(){
      'use strict';
      return {
        restrict: 'A',
        link: function(scope, elem, attr){
          try {
            var options = {};
            switch( attr.type ){
              default:
              case 'personTeaser':
                options = {
                  delay: 200,
                  content: '<h1>TEST</h1>',
                  html: true,
                  trigger: 'manual',
                  placement: attr.placement || 'left',
                  title: 'Jesus Rocha'
                };
            }
            $(elem).popover( options )
              .on('mouseenter', function () {
                var _this = this;
                $(this).popover('show');
                $('.popover').on('mouseleave', function () {
                  $(_this).popover('hide');
                });
              }).on('mouseleave', function () {
                var _this = this;
                if (!$('.popover:hover').length) {
                  $(_this).popover('hide');
                }
              });
          } catch(e) {
            console.error( 'PopOver not found!');
          }
        }
      };
    }
  ]);