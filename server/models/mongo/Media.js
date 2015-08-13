'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    filename: {type: String, required: true},
    size: {type: Number, required: true},
    type: {type: String, required: true},
    url: {type: String, required: true},
    container: {type: String, required: true},
    created: {type: Date, default: Date.now },
    order: {type: Number, default: 0},
    _owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
    _removed: {type: Boolean, default: false}
  }),
  Article = mongoose.model('Media', schema);

module.exports = Article;