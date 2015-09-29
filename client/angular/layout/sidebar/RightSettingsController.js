angular.module('baseApp.controllers')
  .controller('RightSettingsController', ['$scope','currentUser','$rootScope',
    function ($scope, currentUser, $rootScope ) {
      'use strict';

      $scope.user = currentUser.get();

      var currColor = '#f56954'; //Red by default
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