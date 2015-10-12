'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema( {
    title: {type: String},
    description: {type: String},
    created: { type: Date, default: Date.now },
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    color: {type: String},  // Labeling
    type: {type: String}, //Story, Feature, Bug, Enhancement, etc.
    start: {type: Boolean, default: false},
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: null },
    column: { type: mongoose.Schema.Types.ObjectId, ref: 'Column', default: null },
    board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true }
  }),
  Task = mongoose.model('Task', schema);

module.exports = Task;