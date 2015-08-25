'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, default: null},
    body: {type: String, required: true}, // HTML
    code: {type: String}, // JAVASCRIPT
    order: {type: Number, required: true},
    created: {type: Date, default: Date.now },
    template: {type: Boolean, default: false}
  }),
  Widget = mongoose.model('Widget', schema);

module.exports = Widget;