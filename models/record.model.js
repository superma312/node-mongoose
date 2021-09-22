module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      key: String,
      createdAt: Date,
      counts: [Number]
    }, {
      toObject: {
        transform: function (doc, ret) {
          delete ret._id;
        }
      },
      toJSON: {
        transform: function (doc, ret) {
          delete ret._id;
        }
      }
    }
  );

  const Record = mongoose.model("record", schema);

  return Record;
};
