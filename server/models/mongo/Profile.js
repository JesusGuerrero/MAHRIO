'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    title: String,
    firstName: String,
    lastName: String,
    role: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    _owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true, unique: true}
  }),
  Profile = mongoose.model('Profile', schema);

module.exports = Profile;