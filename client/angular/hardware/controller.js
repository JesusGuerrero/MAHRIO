angular.module('baseApp.controllers')
  .controller( 'HardwareController', [ '$scope', '$http', 'Socket','Hardware', 'Notification', '$state',
    function( $scope, $http, Socket, Hardware, Notification, $state ){
      'use strict'; /* global alert */
      var namespaces;
      Socket.setIp( '192.168.0.10' );
      $scope.sendMessage = function( ) {
        Socket.queryIp( $scope.msg );
        if( namespaces.indexOf( $scope.namespace ) === -1 ) {
          namespaces.push( $scope.namespace );
          Socket.receiveMessage( $scope.namespace, function( data ) {
            console.log( data );
            alert( data );
          });
        }
      };
      $scope.hardware = {};
      Hardware.get( 'raspberry' )
        .then( function( res ) {
          $scope.hardware = res.devices;
        });
      //$scope.socketEvent = function() {
      //  Socket.receiveMessage('192.168.0.10:question:active', function (res) {
      //    $scope.isActive = res.active;
      //  });
      //};
      $scope.newHardware = function(){
        $('#modalHardwareForm' ).modal().show();
      };
      $scope.editHardware = function( hardware ){
        $scope.edit = hardware;
        $('#modalHardwareForm' ).modal().show();
      };

      $scope.remove = function( id ){
        Notification.id = id;
        Notification.confirm = 'Are you sure you want to delete?' + id;
        Notification.confirmed = false;
      };
      $scope.$watch( function(){ return Notification.confirmed; }, function(newVal) {
        if (newVal) {
          Notification.confirmed = null;
          Hardware.remove( Notification.id )
            .then( function(){
              $state.reload();
            });
        }
      });

    }]);