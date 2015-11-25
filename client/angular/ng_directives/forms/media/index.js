angular.module('baseApp.directives')
  .directive('media', ['Media','User','$http',
    function( ){
      'use strict';
      return {
        restrict: 'E',
        replace: true,
        templateUrl: '/assets/html/ng_directives/forms/media/index.html',
        scope: {
          media: '=',
          actions: '=',
          container: '@'
        },
        link: function( scope, el, attr ) {
          //scope.media = {};
          var imageObject = {}, fileInput = el.find('input');
          scope.filename = 'none';
          fileInput.bind('change', function(event) {
            var files = event.target.files;
            scope.$apply(function(){
              scope.file = files[0];
              scope.filename = scope.file.name;
              scope.readyToUpload = true;
            });
            imageObject = {
              filename: scope.file.name,
              type: scope.file.type,
              size: scope.file.size,
              container: scope.container
            };
          });

          scope.getDefault = function(){
            if( attr.icon ) {
              return attr.icon;
            } else {
              return 'fa-user';
            }
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
          scope.proceedRemove = function(){
            scope.actions.remove()
              .then(function(){
                scope.media = null;
              });
          };
        }
      };
    }]);