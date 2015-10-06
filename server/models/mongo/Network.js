'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String },   // internal, external
    domain: { type: String }, // finance, technology, etc
    location: { type: String }, // greater area, country, city, high school, etc.
    created: { type: Date, default: Date.now },
    start: { type: Date },
    end: { type: Date },
    isPrivate: { type: Boolean, default: false },
    isProtected: { type: Boolean, default: false },
    coverImage: { type: mongoose.Schema.Types.ObjectId , ref: 'Media' },
    boards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }],
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CalendarEvent' }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    admins: [{type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
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