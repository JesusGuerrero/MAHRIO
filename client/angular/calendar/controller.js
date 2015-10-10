angular.module('baseApp.controllers')
  .controller('CalendarController', ['$scope', 'Calendar', function($scope,Calendar){
    'use strict';

    function initEvents(ele) {
      ele.each(function() {

        // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
        // it doesn't need to have a start or end
        var eventObject = {
          title: $.trim($(this).text()),  // use the element's text as the event title
          stick: true,
          color: $(this).css('background-color')
        };

        // store the Event Object in the DOM element so we can get to it later
        $(this).data('eventObject', eventObject);

        // make the event draggable using jQuery UI
        $(this).draggable({
          zIndex: 1070,
          revert: true, // will cause the event to go back to its
          revertDuration: 0  //  original position after the drag
        });

      });
    }
    initEvents($('#external-events div.external-event'));
    var currColor = '#f56954'; //Red by default
    //Color chooser button
    var colorChooser = $('#color-chooser-btn');
    $('#color-chooser > li > a').click(function(e) {
      e.preventDefault();
      //Save color
      currColor = $(this).css('color');
      //Add color effect to button
      colorChooser
        .css({'background-color': currColor, 'border-color': currColor})
        .html($(this).text()+' <span class="caret"></span>');
    });
    $('#add-new-event').click(function(e) {
      e.preventDefault();
      //Get value and make sure it is not null
      var val = $('#new-event').val();
      if (val.length === 0) {
        return;
      }

      //Create event
      var event = $('<div />');
      event.css({'background-color': currColor, 'border-color': currColor, 'color': '#fff'}).addClass('external-event');
      event.html(val);
      $('#external-events').prepend(event);

      //Add draggable funtionality
      initEvents(event);

      //Remove event from text input
      $('#new-event').val('');
    });

    $scope.newEvent = function(){
      Calendar.currentEventId = null;
      $('#modalEditEvent' ).modal().show();
    };
  }])
  .controller('EventsController', [function(){
    'use strict';


  }]);