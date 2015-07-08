'use strict';

var mongoose = require('mongoose'),
  schema, Task;

schema = mongoose.Schema( {
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  title: {type: String},
  description: {type: String},
  color: {type: String},
  isStarted: {type: Boolean, default: false},
  isBlocked: {type: Boolean, default: false},
  isReviewed: {type: Boolean, default: false},
  isTested: {type: Boolean, default: false},
  isApproved: {type: Boolean, default: false},
  isValidated: {type: Boolean, default: false},
  isDone: {type: Boolean, default: false},
  created: { type: Date, default: Date.now },
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

Task = mongoose.model('Task', schema);

module.exports = Task;