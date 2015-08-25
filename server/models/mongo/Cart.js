'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    products: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
    checkout: {type: Boolean}
  }),
  Cart = mongoose.model('Cart', schema);

module.exports = Cart;