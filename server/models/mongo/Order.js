'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    _owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    carts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Cart'}]
  }),
  Order = mongoose.model('Order', schema);

module.exports = Order;