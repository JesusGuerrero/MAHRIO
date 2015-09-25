'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    name: { type: String },
    type: { type: String },   // internal, external
    domain: { type: String }, // finance, technology, etc
    location: { type: String }, // greater area, country, city, high school, etc.
    created: { type: Date, default: Date.now },
    start: { type: Date },
    end: { type: Date },
    isPrivate: { type: Boolean, default: false },
    boards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }],
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CalendarEvent' }],
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }),
  Network = mongoose.model('Network', schema);

module.exports = Network;

/*
  Access:
    admin - can see all memberships
    moderator - administers x numbers of memberships
    authorized - registered & belongs to x number of memberships

  Memberships - authorized dependant
    counselor - consultant, guidance, path
    teacher - educator, facilitator, moderator

    client - engages professional services
    student - seeks knowledge of professional experience
 */