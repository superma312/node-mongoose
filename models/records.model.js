const mongoose = require("mongoose");

/**
 * Record model schema.
 */
const recordSchema = mongoose.Schema({
  key: String,
  createdAt: Date,
  counts: [Number]
});

const RecordModel = mongoose.model("record", recordSchema);

module.exports = RecordModel;
