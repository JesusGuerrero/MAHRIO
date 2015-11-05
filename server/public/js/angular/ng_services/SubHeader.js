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
      set: subHeader,
      setHeader: function setHeader( name ) {
        subHeader.title = 'Task';
        subHeader.breadcrumbs = [
          {
            url: 'adminDash',
            value: 'Home'
          },
          {
            url: 'task',
            value: 'Task'
          },
          {
            url: 'adminDash',
            value: name
          }
        ];
      }
    };
  }]);
