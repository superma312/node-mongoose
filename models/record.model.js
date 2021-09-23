const mongoose = require("mongoose");

/**
 * Record model schema.
 */
const recordSchema = mongoose.Schema({
  key: String,
  createdAt: Date,
  counts: [Number]
});

const Record = mongoose.model("record", recordSchema);

module.exports = Record;
