const Playlists = require('_models/Playlists');

async function create(req, res) {
  try {
    const { _id } = req.user;
    const { title } = req.body;
    if (!title) return res.status(400).send({ title: ['El atributo título es obligatorio'] });
    const playlist = await Playlists.create({ user: _id, title });
    return res.send(playlist.toObject());
  } catch (error) {
    return res.status(500).send(error);
  }
}

async function remove(req, res) {
  try {
    const { _id } = req.user;
    const { playlist } = req.params;
    if (!playlist) return res.sendStatus(400).send({ playlist: ['El atributo playlist es obligatorio'] });
    const found = await Playlists.findOneAndDelete({ _id: playlist, user: _id }).exec();
    if (!found) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send(error);
  }
}

async function update(req, res) {
  try {
    const { _id } = req.user;
    const { playlist } = req.params;
    if (!req.body.title) return res.sendStatus(200);
    if (!playlist) return res.sendStatus(400).send({ playlist: ['El atributo playlist es obligatorio'] });
    const found = await Playlists.findOneAndUpdate(
      { _id: playlist, user: _id }, { title: req.body.title }, { new: true },
    ).populate('songs').exec();
    if (!found) return res.sendStatus(404);
    return res.status(200).send(found);
  } catch (error) {
    return res.status(500).send(error);
  }
}

async function addSong(req, res) {
  try {
    const { _id } = req.user;
    const { playlist, song } = req.params;
    if (!song) return res.sendStatus(200);
    if (!playlist) return res.sendStatus(400).send({ playlist: ['El atributo playlist es obligatorio'] });
    const found = await Playlists.findOneAndUpdate(
      { _id: playlist, user: _id }, { $push: { songs: song } }, { new: true },
    ).exec();
    if (!found) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send(error);
  }
}

async function removeSong(req, res) {
  try {
    const { _id } = req.user;
    const { playlist, song } = req.params;
    if (!song) return res.sendStatus(200);
    if (!playlist) return res.sendStatus(400).send({ playlist: ['El atributo playlist es obligatorio'] });
    const found = await Playlists.findOneAndUpdate(
      { _id: playlist, user: _id },
      { $pull: { songs: song } },
    ).exec();
    if (!found) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send(error);
  }
}

async function getByUser(req, res) {
  try {
    const { _id } = req.user;
    const found = await Playlists.find({ user: _id }).exec();
    return res.send(found);
  } catch (error) {
    return res.status(500).send(error);
  }
}

async function getById(req, res) {
  try {
    const { _id } = req.user;
    const { playlist } = req.params;
    if (!playlist) return res.sendStatus(400).send({ playlist: ['El atributo playlist es obligatorio'] });
    const found = await Playlists.find({ user: _id, _id: playlist }).populate('songs').exec();
    return res.send(found.toObject());
  } catch (error) {
    return res.status(500).send(error);
  }
}

module.exports = {
  getById,
  getByUser,
  create,
  remove,
  removeSong,
  update,
  addSong,
};
