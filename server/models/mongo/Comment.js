var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    content: { type: String },
    created: { type: Date, default: Date.now },
    _owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }),
  Comment = mongoose.model('Comment', schema);

module.export = Comment;