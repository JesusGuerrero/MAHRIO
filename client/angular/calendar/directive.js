angular.module('baseApp.directives')
  .directive('calendar', ['Calendar',
    function( Calendar ){
      'use strict';
      return {
        restrict: 'A',
        scope: {},
        link: function(scope, elem, attrs ) {
          var calendar;

          Calendar.getEvents()
            .then( function(response){
              scope.events = response.events;
              initCalendar();
            });

          function updateEvent( event ){
            Calendar.updateEvent( {
              _id: event._id,
              start: event.start._d,
              end: event.end._d
            });
          }

          function initCalendar(){
            calendar = $(elem).fullCalendar({
              header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
              },
              height: 600,
              timezone: 'local',
              defaultDate: new Date(),
              defaultView: 'agendaWeek',
              editable: true,
              eventLimit: true, // allow "more" link when too many events
              events: scope.events,
              droppable: true, // this allows things to be dropped onto the calendar !!!
              drop: function( date){
                var originalEventObject = $(this).data('eventObject');
                var copiedEventObject = $.extend({}, originalEventObject);
                copiedEventObject.start = new Date( date._d );
                copiedEventObject.end = new Date( new Date(date._d).getTime() + 7200000 );
                copiedEventObject.allDay = false;

                Calendar.createEvent( copiedEventObject )
                  .then( function(res){
                    copiedEventObject.id = res.event._id;
                    $(elem).fullCalendar('renderEvent', copiedEventObject, true);
                  });
                if ($('#drop-remove').is(':checked')) {
                  $(this).remove();
                }
              },
              dayClick: function(date, jsEvent, view) {
                console.log('Day clicked');
                console.log(date);
                console.log(jsEvent);
                console.log(view);
              },
              eventClick: function(event){
                Calendar.currentEvent = event;
                $('#'+attrs.modalId).modal().show();
                scope.$apply();
                if (event.url) {
                  //window.open(event.url);
                  //return false;
                }
              },
              eventDrop: updateEvent,
              eventResize: updateEvent
            });
          }

          scope.$on('event:removeSuccess', function( e, eventId ){
            calendar.fullCalendar("removeEvents",  eventId );
          });
        }
      };
    }
  ]);