angular.module('baseApp.services').factory('Socket', [ 'socketFactory', function( socket ) {
  'use strict';

  var mySocket = socket();
  mySocket.forward('socket:pong');
  return mySocket;

}]);