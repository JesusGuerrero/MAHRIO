angular.module('baseApp.controllers')
  .controller('RightSettingsController', ['$scope','currentUser','$rootScope',
    function ($scope, currentUser, $rootScope ) {
      'use strict';

      $scope.user = currentUser.get();

      var matches = {
        'skin-blue': { name: 'Blue', rgb: '#3c8dbc'},
        'skin-green': { name: 'Green', rgb: '#00a65a' },
        'skin-yellow': { name: 'Yellow', rgb: '#f39c12' },
        'skin-purple': { name: 'Purple', rgb: '#605ca8' },
        'skin-red': { name: 'Red', rgb: '#dd4b39' }
      };
      $scope.skin = matches[ $rootScope.settings.skin] || matches[ 'skin-blue' ] ;

      var currColor = matches[ $rootScope.settings.skin].rgb || '#f56954';
      //Color chooser button
      var colorChooser = $('#theme-chooser-btn');
      $('#theme-chooser > li > a').click(function(e) {
        var settings = $rootScope.settings;
        $('body').addClass( $(this).attr('data') ).removeClass( settings.skin );
        settings.skin = $(this).attr('data');
        $rootScope.setSettings( settings );
        e.preventDefault();
        //Save color
        currColor = $(this).css('color');
        //Add color effect to button
        colorChooser
          .css({'background-color': currColor, 'border-color': currColor})
          .html($(this).text()+' <span class="caret"></span>');
      });
    }
  ]);