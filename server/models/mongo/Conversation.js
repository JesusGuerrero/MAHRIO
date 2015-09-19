var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    topic: { type: String },
    created: { type: Date, default: Date.now },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Access Control
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    network: {type: mongoose.Schema.Types.ObjectId, ref: 'Network'}
  }),
  Conversation = mongoose.model('Conversation', schema);

module.exports = Conversation;