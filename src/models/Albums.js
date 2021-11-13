const { Schema, model, Types } = require('mongoose');

const AlbumSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: Types.ObjectId,
    required: true,
    ref: 'Artists',
  },
  image: String,
});

AlbumSchema.index({ title: 'text' });
module.exports = model('Albums', AlbumSchema);
