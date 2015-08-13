'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    name: {type: String},
    attributes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Attribute'}],
    price: {type: Number}
  }),
  Product = mongoose.model('Product', schema);

module.exports = Product;