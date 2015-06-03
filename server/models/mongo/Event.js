'use strict';

var mongoose = require('mongoose'),
  schemaEvent, Event;

schemaEvent = mongoose.Schema({
  title: {type: String, required: true},
  start: {type: String},
  end: {type: Date },
  allDay: {type: Boolean },
  url: {type: String},
  color: {type: String},
  created: { type: Date, default: Date.now },
  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

Event = mongoose.model( 'Event', schemaEvent);

module.exports = {
  event: Event
};