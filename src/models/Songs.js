const { Schema, Types, model } = require('mongoose');

const SongSchema = new Schema({
  title: {
    type: String,
    required: true,
    index: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  album: {
    type: Types.ObjectId,
    required: true,
    ref: 'Albums',
  },
  genre: {
    type: Types.ObjectId,
    required: true,
    ref: 'Genres',
  },
  image: String,
  filename: String,
});

SongSchema.index({ title: 'text' });
module.exports = model('Songs', SongSchema);
