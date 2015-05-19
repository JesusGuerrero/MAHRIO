var mongoose = require('mongoose'),
  schemaConversation, Conversation,
  schemaMessage, Message,
  schemaMembership, Membership;

schemaMessage = mongoose.Schema({
  content: { type: String },
  created: { type: Date, default: Date.now },
  _conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

schemaMembership = mongoose.Schema({
  type: { type: String },
  domain: { type: String },
  created: { type: Date, default: Date.now },
  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  _conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }
});

schemaConversation = mongoose.Schema({
  created: { type: Date, default: Date.now },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
});

Conversation = mongoose.model('Conversation', schemaConversation);
Membership = mongoose.model('Membership', schemaMembership);
Message = mongoose.model('Message', schemaMessage);

module.exports = {
  conversation: Conversation,
  membership: Membership,
  message: Message
};