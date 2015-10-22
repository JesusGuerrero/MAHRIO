angular.module('baseApp.directives')
  .directive('networkForm', ['Network', 'FormHelper', '$state', function(Network, FormHelper, $state ){
    'use strict';

    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/assets/html/network/form',
      scope: {
        edit: '='
      },
      link: function( scope ) {

        scope.$watch( function(){ return scope.edit; }, function(newVal){
          if( newVal ) {
            scope.network = newVal;
            scope.has = {
              owner: newVal.owner ? true : false,
              members: newVal.members && Object.keys(newVal.members) ? true : false,
              admins: newVal.admins && Object.keys( newVal.admins ) ? true : false
            };
            console.log( newVal );
          }
        });
        scope.network = {
          admins: {},
          members: {},
          owner: {}
        };
        scope.has = {
          owner: false,
          members: false,
          admins: false
        };

        FormHelper.setupFormHelper(scope, 'network', Network );

        scope.save = function(){
          if( scope.network._id ) {
            Network.update( scope.network )
              .then( function(){
                $state.reload();
              });
          } else {
            Network.add( scope.network )
              .then( function(){
                $state.reload();
              });
          }
        };
      }
    };
  }]);
