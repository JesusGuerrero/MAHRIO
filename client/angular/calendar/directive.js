angular.module('baseApp.directives')
  .directive('calendar', ['Calendar',
    function( Calendar ){
      'use strict';
      return {
        restrict: 'A',
        scope: {
        },
        link: function(scope, elem, attrs ) {
          $(elem).fullCalendar({
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
            events: scope.$parent.events,
            droppable: true, // this allows things to be dropped onto the calendar !!!
            drop: function( date ){
              Calendar.createEvent( {
                title: $(this).html(),
                start: new Date( date._d ),
                end: new Date( new Date(date._d).getTime() + 7200000 ), //two-hour frame
                backgroundColor: $(this).css('backgroundColor'),
                borderColor: $(this).css('borderColor')
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
              console.log('Event Clicked', attrs.modalId);
              $('#'+attrs.modalId).modal().show();
              if (event.url) {
                //window.open(event.url);
                //return false;
              }
            }
          });
        }
      };
    }
  ]);