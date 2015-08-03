var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    created: { type: Date, default: Date.now },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Access Control
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
  }),
  Conversation = mongoose.model('Conversation', schema);

module.exports = Conversation;