const { Schema, Types, model } = require('mongoose');

const PlaylistSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  user: {
    type: Types.ObjectId,
    required: true,
    ref: 'Users',
  },
  songs: [{
    type: Types.ObjectId,
    ref: 'Songs',
  }],
  image: String,
});

module.exports = model('Playlists', PlaylistSchema);
