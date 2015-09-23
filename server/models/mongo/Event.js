'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String},
    isPrivate: {type: Boolean},
    start: {type: String},
    end: {type: Date },
    allDay: {type: Boolean },
    url: {type: String},
    color: {type: String},
    created: { type: Date, default: Date.now },
    invited: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    accepted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  });

module.exports = mongoose.model( 'CalendarEvent', schema);