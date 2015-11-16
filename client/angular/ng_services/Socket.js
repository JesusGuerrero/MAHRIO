/* global io */

angular.module('baseApp.services').factory('Socket', [ '$http', function( $http ) {
  'use strict';

  //var mySocket = socket();
  ////mySocket.forward('socket:pong');
  //return mySocket;
  var socket = io(), ip = '';
  //socket.on('event:restroom', function(socket){
  //  console.log('message: ' + socket);
  //});

  return {
    get: socket,
    sendMessage: function(){},
    receiveMessage: function( msg, cb ){
      socket.on( msg, cb || function(){});
    },
    setIp: function( ipParam ) {
      ip = ipParam;
    },
    queryIp: function( cmd, cb ) {
      $http.get( '/api/raspberrys/' + ip + '/' + cmd )
        .success( cb || function(){} );
    }
  };

}]);