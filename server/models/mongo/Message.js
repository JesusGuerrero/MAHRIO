'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    content: { type: String },
    created: { type: Date, default: Date.now },
    _conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }),
  Message = mongoose.model('Message', schema);

module.exports = Message;