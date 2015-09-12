'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    resource: {type: String, required: true},
    id: {type: String, required: true},
    heading: String,
    teaser: String,
    created: { type: Date, default: Date.now},
    count: Number,
    _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }),
  Notification = mongoose.model('Notification', schema);

module.exports = Notification;


