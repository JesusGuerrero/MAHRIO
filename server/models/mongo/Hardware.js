'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    title: {type: String, required: true},
    ip: {type: String},
    port: {type: Number },
    type: { type: String },
    coverImage: {type: mongoose.Schema.Types.ObjectId, ref: 'Media'},
    //media: [{type: mongoose.Schema.Types.ObjectId, ref: 'Media'}],
    //messages: [ {type: String}],
    //widgets: [{type: mongoose.Schema.Types.ObjectId, ref: 'Widget'}],
    created: { type: Date, default: Date.now },
    //published: {type: Boolean},
    //network: {type: mongoose.Schema.Types.ObjectId, ref: 'Network'},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
  }),
  Hardware = mongoose.model('Hardware', schema);

module.exports = Hardware;