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
            var allDay;
            if( /(\d{4})-(\d{2})-(\d{2})T/.test( event.start.format() ) ) {
              allDay = false;
            } else {
              allDay = true;
            }

            Calendar.updateEvent( {
              _id: event._id,
              start: new Date( event.start.format() ).toISOString(), //event.start._d,
              end: event.end ? new Date( event.end.format() ).toISOString() : null,
              allDay: allDay
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
              timezone: 'UTC',
              defaultDate: new Date(),
              defaultView: 'agendaWeek',
              editable: true,
              eventLimit: true, // allow "more" link when too many events
              events: scope.events,
              droppable: true, // this allows things to be dropped onto the calendar !!!
              drop: function( date){
                var copiedEventObject = $.extend({}, $(this).data('eventObject') );
                copiedEventObject.start = new Date( date.format() ).toISOString();
                if( $(elem).fullCalendar('getView').name === 'month' ) {
                  copiedEventObject.allDay = true;
                } else {
                  if( /(\d{4})-(\d{2})-(\d{2})T/.test( date.format() ) ) {
                    copiedEventObject.allDay = false;
                    copiedEventObject.end = new Date( new Date(date.format() ).getTime() + 7200000 ).toISOString();
                  } else {
                    copiedEventObject.allDay = true;
                  }
                }

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
            calendar.fullCalendar('removeEvents',  eventId );
          });
        }
      };
    }
  ]);