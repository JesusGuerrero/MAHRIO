angular.module('baseApp.services')
  .factory('SubHeader', [ function() {
    'use strict';

    var subHeader = {
      title: 'Title',
      subTitle: 'Sub Title',
      breadcrumbs: [
        {
          url: 'adminDash',
          value: 'Home'
        },
        {
          url: 'adminDash',
          value: 'Blank Page'
        }
      ]
    };
    return {
      get: function(){
        return subHeader;
      },
      set: subHeader
    };
  }]);
