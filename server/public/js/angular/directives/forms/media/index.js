angular.module('baseApp.directives')
  .directive('media', ['Media','User','$http',
    function( Media, User, $http ){
      'use strict';
      return {
        restrict: 'E',
        replace: true,
        templateUrl: '/assets/html/directives/forms/media/index.html',
        scope: {
          media: '=',
          actions: '=',
          container: '@'
        },
        link: function( scope, el ) {
          //scope.media = {};
          scope.$watch( function(){ return scope.media; }, function(ol, nw){

          });
          var imageObject = {}, fileInput = el.find('input');
          scope.filename = 'none';
          fileInput.bind('change', function(event) {
            var files = event.target.files;
            scope.$apply(function(){
              scope.file = files[0];
              scope.filename = scope.file.name;
            });
            imageObject = {
              filename: scope.file.name,
              type: scope.file.type,
              size: scope.file.size,
              container: scope.container
            };
          });

          scope.getDefault = function(){
            return 'fa-user';
          };
          scope.setupFile = function(){
            fileInput.click();
          };
          scope.proceedUpload = function(){
            scope.actions.upload( imageObject, scope.file )
              .then( function( res ){
                scope.media = {
                  url: res.url
                };
                scope.readyToUpload = false;
              });
          };
          scope.cancelUpload = function() {
            fileInput.value = '';
            scope.file = {
              filename: ''
            };
          };
        }
      };
    }]);