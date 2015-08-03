var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    name: { type: String }, // Board Name
    created: { type: Date, default: Date.now },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],  //Lists within Board
    _board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' }
  }),
  Column = mongoose.model('Column', schema);

module.exports = Column;