'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String},
    start: {type: String},
    end: {type: Date },
    allDay: {type: Boolean },
    url: {type: String},
    color: {type: String},
    created: { type: Date, default: Date.now },
    _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    _invited: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    _accepted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  });

module.exports = mongoose.model( 'CalendarEvent', schema);