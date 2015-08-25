angular.module('baseApp.controllers')
  .controller('RestroomController', ['$scope','Socket',
    function ($scope, Socket) {
      'use strict';

      $scope.restroom = false;
      Socket.get.on('event:restroom', function(socket){
        console.log( socket );
        $scope.$apply( function(){
          if( socket === "1") {
            $scope.restroom = true;
          } else {
            $scope.restroom = false;
          }
        });

        //if( conversations[ socket._conversation.id] ){
        //  conversations[ socket._conversation.id ][0].messages.unshift( socket );
        //}
        //if( socket._conversation.id === $scope.currentConversation.id ){
        //  $scope.currentConversation.messages.unshift(socket);
        //}
        //console.log('message: ' + socket.content);
      });

      //$scope.$on('socket:restroom', function(){
      //  console.log('in socket');
      //  $scope.restroom = !$scope.restroom;
      //});

    }
  ]);