'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    title: {type: String, required: true},
    article: {type: mongoose.Schema.Types.ObjectId, ref: 'Article'},
    widgets: [{type: mongoose.Schema.Types.ObjectId, ref: 'Widget'}],
    layout: [{type: String}],
    url: {type: String}
  }),
  Page = mongoose.model('Page', schema);

module.exports = Page;