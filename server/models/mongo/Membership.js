'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    type: { type: String },
    domain: { type: String },
    created: { type: Date, default: Date.now },
    _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    conversations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }],
    boards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }],
    lists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }]
  }),
  Membership = mongoose.model('Membership', schema);

module.exports = Membership;