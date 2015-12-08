var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    topic: { type: String },
    created: { type: Date, default: Date.now },
    update: { type: Date, default: Date.now },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Access Control
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    network: {type: mongoose.Schema.Types.ObjectId, ref: 'Network'}
  });

  schema.pre('save', function(done) {
    'use strict';
    this.updated = Date.now();
    done();
  });
module.exports =  mongoose.model('Conversation', schema);