'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    key: {type: String},
    value: {type: String}
  }),
  Attribute = mongoose.model('Attribute', schema);

module.exports = Attribute;