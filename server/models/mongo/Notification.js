'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    resource: {type: String, required: true},
    id: {type: String, required: true},
    created: { type: Date, default: Date.now},
    _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }),
  Notification = mongoose.model('Notification', schema);

module.exports = Notification;


