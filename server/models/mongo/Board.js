var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    name: { type: String }, // Board Name
    created: { type: Date, default: Date.now },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], //Access Control
    columns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Column' }],  //Lists within Board
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    startColumn: {type: String, default: 'To Do'},
    _owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    _removed: {type: Boolean, default: false}
  }),
  Board = mongoose.model('Board', schema);

module.exports = Board;