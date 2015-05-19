angular.module('baseApp.directives')
  .directive('iCheckBox', ['$rootScope',
    function(){
      'use strict';
      return {
        restrict: 'A',
        link: function(scope, elem){
          try {
            $('input[type="checkbox"]', $(elem)).iCheck({
              checkboxClass: 'icheckbox_flat-blue',
              radioClass: 'iradio_flat-blue'
            });
          } catch(e) {
            console.error( 'iCheck not found!');
          }
        }
      };
    }
  ])
  .directive('iCheckAll', ['$rootScope',
    function(){
      'use strict';
      return {
        restrict: 'A',
        link: function(scope, elem, attr){
          console.log( attr );
          try {
            $(elem).click(function () {
              var clicks = $(this).data('clicks');
              if (clicks) {
                //Uncheck all checkboxes
                $('.' +attr.iCheckAll+' input[type="checkbox"]').iCheck('uncheck');
                $('.fa', this).removeClass('fa-check-square-o').addClass('fa-square-o');
              } else {
                //Check all checkboxes
                $('.' +attr.iCheckAll+' input[type="checkbox"]').iCheck('check');
                $('.fa', this).removeClass('fa-square-o').addClass('fa-check-square-o');
              }
              $(this).data('clicks', !clicks);
            });
          } catch(e) {
            console.error( 'iCheck not found!');
          }
        }
      };
    }
  ]);
