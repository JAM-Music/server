const Genres = require('_models/Genres');

async function getAll(req, res) {
  try {
    const genres = await Genres.find().exec();
    res.send(genres);
  } catch (error) {
    res.setStatus(500).send(error);
  }
}

module.exports = {
  getAll,
};
