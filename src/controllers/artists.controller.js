const Artists = require('_models/Artists');

async function getAll(req, res) {
  const artists = await Artists.find();
  res.send(artists);
}

module.exports = { getAll };
