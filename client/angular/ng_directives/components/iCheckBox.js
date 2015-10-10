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
  .directive('iCheck', ['$timeout', function($timeout) {
    'use strict';
    return {
      require: 'ngModel',
      link: function ($scope, element, $attrs, ngModel) {
        return $timeout(function () {
          var value;
          value = $attrs.value;

          $scope.$watch($attrs.ngModel, function () {
            $(element).iCheck('update');
          });

          return $(element).iCheck({
            checkboxClass: 'icheckbox_flat-blue',
            radioClass: 'iradio_flat-aero'

          }).on('ifChanged', function (event) {
            if ($(element).attr('type') === 'checkbox' && $attrs.ngModel) {
              $scope.$apply(function () {
                return ngModel.$setViewValue(event.target.checked);
              });
            }
            if ($(element).attr('type') === 'radio' && $attrs.ngModel) {
              return $scope.$apply(function () {
                return ngModel.$setViewValue(value);
              });
            }
          }).on( 'ifToggled', function( ) {
            if( typeof $attrs.ngClick !== 'undefined' ) {
              $scope.$eval( $attrs.ngClick );
            }
          });
        });
      }
    };
  }])
  .directive('iCheckAll', ['$rootScope',
    function(){
      'use strict';
      return {
        restrict: 'A',
        link: function(scope, elem, attr){
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
