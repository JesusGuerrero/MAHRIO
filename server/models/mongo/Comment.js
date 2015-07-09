var mongoose = require('mongoose'),
  schema, Comment;

schema = mongoose.Schema({
  content: { type: String },
  created: { type: Date, default: Date.now },
  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

Comment = mongoose.model('Commnet', schema);

module.export = Comment;