'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    type: { type: String }, // educator / learner
    domain: { type: String }, // finance, technology, etc
    location: { type: String }, // greater area, country, city, high school, etc.
    created: { type: Date, default: Date.now },
    start: { type: Date },
    end: { type: Date },
    boards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }],
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CalendarEvent' }]
  }),
  Network = mongoose.model('Network', schema);

module.exports = Network;

/*
  Access:
    sudo - can see all memberships
    admin - administers x numbers of memberships
    authorized - registered & belongs to x number of memberships

  Memberships - authorized dependant
    counselor - consultant, guidance, path
    teacher - educator, facilitator, moderator

    client - engages professional services
    student - seeks professional experience
 */