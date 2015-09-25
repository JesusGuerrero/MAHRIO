angular.module('baseApp.directives')
  .directive('calendar', ['Calendar','$state','_',
    function( Calendar, $state, _ ){
      'use strict';
      return {
        restrict: 'A',
        scope: {},
        link: function(scope, elem, attrs ) {
          var calendar;

          Calendar.get()
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
            var theEvent = _.find( scope.events, function(item){ return item._id === event._id; });
            theEvent.start = new Date( event.start.format() ).toISOString();
            theEvent.end = event.end ? new Date( event.end.format() ).toISOString() : null;
            theEvent.allDay = allDay;
            theEvent.invited = Object.keys(_.indexBy( theEvent.invited, '_id' ));

            Calendar.update( theEvent );

          }
          var renderView;
          switch( $state.current.name ) {
            case 'calendar.month':
              renderView = 'month';
              break;
            case 'calendar.day':
              renderView = 'agendaDay';
              break;
            default:
              renderView = 'agendaWeek';
              break;
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
              defaultView: renderView,
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

                Calendar.add( copiedEventObject )
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
                Calendar.currentEventId = event._id;
                $('#'+attrs.modalId ).modal().show();
                scope.$apply();
                if (event.url) {

                }
              },
              eventDrop: updateEvent,
              eventResize: updateEvent
            });
            var clicked = [0,0,0];
            $('.fc-month-button', elem).on('click', function(){
              if( clicked[0] ) {
                return;
              }
              clicked = [1,0,0];
              scope.$apply( function(){
                $state.go('calendar.month');
              });
            });
            $('.fc-agendaWeek-button', elem).on('click', function(){
              if( clicked[1] ) {
                return;
              }
              clicked = [0,1,0];
              scope.$apply( function() {
                $state.go('calendar');
              });
            });
            $('.fc-agendaDay-button', elem).on('click', function(){
              if( clicked[2] ) {
                return;
              }
              clicked = [0,0,1];
              scope.$apply( function() {
                $state.go('calendar.day');
              });
            });
          }

          scope.$on('event:removeSuccess', function( e, eventId ){
            calendar.fullCalendar('removeEvents',  eventId );
          });
        }
      };
    }
  ]);