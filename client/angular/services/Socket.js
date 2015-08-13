angular.module('baseApp.services').factory('Socket', [ function() {
  'use strict';

  //var mySocket = socket();
  ////mySocket.forward('socket:pong');
  //return mySocket;
  var socket = io();
  //socket.on('event:restroom', function(socket){
  //  console.log('message: ' + socket);
  //});

  return {
    get: socket
  };

}]);