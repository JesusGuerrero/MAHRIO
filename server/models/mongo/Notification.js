'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    resource: {type: String, required: true},
    id: {type: String, required: true, index: true },
    created: { type: Date, default: Date.now},
    _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
  });
  schema.index( {id: 1, _user: 1}, {unique: true});

module.exports = mongoose.model('Notification', schema);


