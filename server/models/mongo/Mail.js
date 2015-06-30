'use strict';

var mongoose = require('mongoose'),
  schemaMail, Mail;//, schemaAttachment, Attachment;

schemaMail = mongoose.Schema({
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  toRead: {type: Boolean, default: false},
  toStarred: {type: Boolean, default: false},
  toArchived: {type: Boolean, default: false},
  toDeleted: {type: Boolean, default: false},
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fromDraft: {type: Boolean, default: false},
  fromStarred: {type: Boolean, default: false},
  fromArchived: {type: Boolean, default: false},
  fromDeleted: {type: Boolean, default: false},
  subject: {type: String, required: true},
  content: {type: String},
  //attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' }],
  created: { type: Date, default: Date.now }
});

/*schemaAttachment = mongoose.Schema({
  type: String,
  filename: String,
  icon: String,
  size: Number,
  _mail: { type: mongoose.Schema.Types.ObjectId, ref: 'Mail' }
});*/

//Attachment = mongoose.model( 'Attachment', schemaAttachment);
schemaMail.statics.findAndModify = function (query, sort, doc, options, callback) {
  return this.collection.findAndModify(query, sort, doc, options, callback);
};

Mail = mongoose.model( 'Mail', schemaMail);

module.exports = Mail;