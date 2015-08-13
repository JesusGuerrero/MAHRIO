'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    heading: {type: String, default: null},
    body: {type: String},
    type: {type: String, default: 'Text'},  // type in [Text, HTML, CSS, JavaScript]
    order: {type: Number, required: true}
  }),
  Section = mongoose.model('Section', schema);

module.exports = Section;