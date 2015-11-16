angular.module('baseApp.directives')
  .directive('modalHardwareForm', [ 'Hardware','FormHelper', function(Hardware, FormHelper){
    'use strict';

    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/assets/html/hardware/form',
      scope: {
        hardwareId: '=',
        edit: '=',
        name: '@'
      },
      link: function( scope ){

        var formSetup = function(){
          FormHelper.setupFormHelper( scope, 'hardware', Hardware );
        };

        scope.$watch( function(){ return scope.edit; }, function(newVal){
          if( newVal ) {
            scope.hardware = newVal;
          } else {
            scope.hardware = { };
          }
        });
        scope.save = function(){
          if( scope.hardware._id ) {
            Hardware.update( scope.hardware )
              .then( function(){
                scope.$emit('closeModal');
              });
          } else {
            Hardware.add( scope.hardware, scope.name )
              .then( function( res ){
                console.log( res );
                scope.$emit('closeModal');
              });
          }
        };
        formSetup();
      }
    };
  }]);