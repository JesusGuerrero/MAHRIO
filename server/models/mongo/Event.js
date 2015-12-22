'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    coverImage: {type: mongoose.Schema.Types.ObjectId, ref: 'Media'},
    title: {type: String, required: true},
    deck: {type: String, required: true},
    description: {type: String},
    isPrivate: {type: Boolean},
    maxRsvp: {type: Number},
    start: {type: String},
    end: {type: Date },
    allDay: {type: Boolean },
    url: {type: String},
    locationName: {type: String},
    locationAddress: {type: String},
    color: {type: String},
    created: { type: Date, default: Date.now },
    invited: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    accepted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    network: {type: mongoose.Schema.Types.ObjectId, ref: 'Network', required: true}
  });

module.exports = mongoose.model( 'CalendarEvent', schema);