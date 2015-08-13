'use strict';

var require = require,
  mongoose = require('mongoose'),
  schema = mongoose.Schema({
    title: String,
    first_name: String,
    last_name: String,
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