const { Schema, model } = require('mongoose');

const ArtistSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: String,
});

ArtistSchema.index({ name: 'text' });
module.exports = model('Artists', ArtistSchema);
