'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    lists: [{type: mongoose.Schema.Types.ObjectId, ref: 'List' }]
  }),
  Contact = mongoose.model( 'Contact', schema);

module.exports = Contact;