angular.module('baseApp.directives')
  .directive('networkForm', ['Network', 'FormHelper', function(Network, FormHelper ){
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
        scope.mediaActions.remove = function( ){
          return Network.removeCoverImage( scope.network._id, scope.network.coverImage._id );
        };

        scope.save = function(){
          if( scope.network._id ) {
            Network.update( scope.network )
              .then( function(){
                scope.$emit('closeModal');
              });
          } else {
            Network.add( scope.network )
              .then( function(){
                scope.$emit('closeModal');
              });
          }
        };
      }
    };
  }]);
