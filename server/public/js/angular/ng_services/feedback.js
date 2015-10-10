angular.module('baseApp.services')
  .factory('FeedbackService', [ function() {
    'use strict';

    var feedbackObject = {};

    return {
      get: function(){ return feedbackObject; },
      set: function(val){ feedbackObject = val; }
    };
  }]);