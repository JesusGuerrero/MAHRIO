'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    type: {type: String, required: true}, // contact, newsletter, question
    message: {type: String, required: true}
  }),
  Contact = mongoose.model( 'Contact', schema);

module.exports = Contact;