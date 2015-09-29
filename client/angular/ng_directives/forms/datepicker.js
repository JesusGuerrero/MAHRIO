
angular.module('baseApp.directives')
  .directive('datepicker', ['$rootScope',
    function( ){
      'use strict';
      return {
        restrict: 'A',
        link: function( scope, elem, attr) {
          /* global moment */
          var option = {
            defaultDate: moment( new Date() ).format( 'MM/DD/YYYY' )
          }, $date;
          scope.$watch( function(){ return attr.datepicker;}, function(newVal){
            if( newVal ) {
              var t = moment( newVal );
              t._isUTC = true;
              $date.val( t.format('MM/DD/YYYY h:mm A'));
            }
          });
          $date = $(elem).datetimepicker( option );
        }
      };
    }]);