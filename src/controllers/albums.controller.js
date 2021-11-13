const Albums = require('_models/Albums');

async function getByArtist(req, res) {
  const { artist } = req.params;
  if (!artist) return res.status(400).send({ astist: ['El campo artista es obligatorio'] });
  const albums = await Albums.find({ author: artist }).populate('author').exec();
  return res.send(albums);
}

module.exports = {
  getByArtist,
};
