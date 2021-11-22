const { Schema, Types, model } = require('mongoose');

const RecentSchema = new Schema({
  user: {
    type: Types.ObjectId,
    required: true,
    ref: 'Users',
  },
  song: {
    type: Types.ObjectId,
    required: true,
    ref: 'Songs',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('Recents', RecentSchema);
