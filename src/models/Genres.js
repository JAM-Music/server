const { Schema, model } = require('mongoose');

const GenreSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: String,
});

module.exports = model('Genres', GenreSchema);
