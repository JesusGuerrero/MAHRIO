angular.module('baseApp.directives')
  .directive('feedbackBox', [ 'FeedbackService',
    function( FeedbackService ){
      'use strict';
      return {
        restrict: 'E',
        template: '<success-message-box success-message="successMessage"></success-message-box>'+
        '<error-message-box validation-errors="validationErrors"></error-message-box>',
        scope: {
          validationErrors: '=errors',
          successMessage: '=success'
        },
        link: function(scope){
          scope.$watch( FeedbackService.get, function(newMessage){
            if( newMessage && newMessage.feedbackSuccess ) {
              scope.successMessage = newMessage.feedbackSuccess;
              delete scope.validationErrors;
              FeedbackService.set({feedbackSuccess: null});
            } else if (newMessage && newMessage.validationErrors ) {
              scope.validationErrors = newMessage.validationErrors;
              delete scope.successMessage;
              FeedbackService.set({validationErrors: null});
            }
          });
        }
      };
    }
  ])
  .directive('successMessageBox', [
    function() {
      'use strict';
      return {
        restrict: 'E',
        scope: {
          msg: '=successMessage'
        },
        replace: true,
        template: '<div id="message-box-slot" ng-show="msg" style="border-radius: 0">'+
        '<div id="message_success" class="bg-success">'+
        '<i class="fa fa-check-square-o fa-2x text-success"></i>'+
        '<h6 class="text-success">{{msg}}</h6>'+
        '</div></div>'
      };
    }
  ])
  .directive('errorMessageBox', [
    function() {
      'use strict';
      return {
        restrict: 'E',
        scope: {
          validationErrors: '=validationErrors'
        },
        replace: true, // Replace with the template below
        template: '<div id="message-box-slot" ng-show="validationErrors.length">'+
        '<div id="message_error" class="bg-danger">'+
        '<i class="fa fa-exclamation-triangle fa-2x text-danger"></i>'+
        '<h6 class="text-danger">We have a few errors</h6>'+
        '<ul><li ng-repeat="error in validationErrors">{{error}}</li></ul>'+
        '</div></div>'
      };
    }
  ]);



