angular.module('baseApp.directives')
  .directive('feedbackBox', [
    function(){
      'use strict';
      return {
        restrict: 'E',
        template: '<success-message-box success-message="successMessage"></success-message-box>'+
        '<error-message-box validation-errors="validationErrors"></error-message-box>',
        scope: {
          validationErrors: '=errors',
          successMessage: '=success'
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
        '<div id="message_success" class="message success">'+
        '<i class="fa fa-check-square-o fa-2x" style="float: left; color:#68B25B; margin-top: 3px"></i>'+
        '<h6>{{msg}}</h6>'+
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
        template: '<div class="alert alert-danger text-center" role="alert" ng-show="validationErrors.length" style="margin-bottom: -20px; border-radius: 0">'+
        '<i class="fa fa-exclamation-triangle"></i>'+
        '<strong>We have a few errors</strong>'+
        '<ul class="ng-hide"><li ng-repeat="error in validationErrors">{{error}}</li></ul>'+
        '</div>'
      };
    }
  ]);



