'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    name: { type: String }, // List Name (Newsletter, Survey X, Poll Y, SignUp Event Z, etc.)
    created: { type: Date, default: Date.now },
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],  //Lists within Board
    _owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }),
  List = mongoose.model('List', schema);

module.exports = List;