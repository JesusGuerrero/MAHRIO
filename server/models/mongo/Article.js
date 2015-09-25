'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    title: {type: String, required: true},
    deck: {type: String},
    media: [{type: mongoose.Schema.Types.ObjectId, ref: 'Media'}],
    sections: [{type: mongoose.Schema.Types.ObjectId, ref: 'Section'}],
    widgets: [{type: mongoose.Schema.Types.ObjectId, ref: 'Widget'}],
    created: { type: Date, default: Date.now },
    published: {type: Boolean},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
  }),
  Article = mongoose.model('Article', schema);

module.exports = Article;