const { Types } = require('mongoose');
const { destination } = require('_config/multer');
const Playlists = require('_models/Playlists');
const FS = require('fs/promises');
const path = require('path');

async function populatePlaylist(user, _id) {
  const match = { user: Types.ObjectId(user) };
  if (_id) {
    // eslint-disable-next-line no-underscore-dangle
    match._id = Types.ObjectId(_id);
  }
  const playlist = await Playlists.aggregate([
    { $match: match },
    {
      $lookup: {
        from: 'songs',
        as: 'songs',
        let: { songsId: '$songs' },
        pipeline: [
          { $match: { $expr: { $in: ['$_id', '$$songsId'] } } },
          {
            $lookup: {
              from: 'albums',
              as: 'album',
              let: { albumId: '$album' },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$$albumId', '$_id'] },
                  },
                },
                {
                  $lookup: {
                    from: 'artists',
                    as: 'author',
                    localField: 'author',
                    foreignField: '_id',
                  },
                },
                { $unwind: '$author' },
              ],
            },
          },
          {
            $lookup: {
              from: 'genres',
              as: 'genre',
              localField: 'genre',
              foreignField: '_id',
            },
          },
          { $unwind: '$genre' },
          { $unwind: '$album' },
          { $set: { sort: { $indexOfArray: ['$$songsId', '$_id'] } } },
          { $sort: { sort: 1 } },
          { $unset: 'sort' },
        ],
      },
    },
  ]);
  return playlist;
}

async function create(req, res) {
  try {
    const { _id } = req.user;
    const { title } = req.body;
    const error = {};
    if (!title) error.title = ['El atributo es obligatorio'];
    if (!req.file) error.image = ['El atributo es obligatorio'];
    if (Object.keys(error).length) return res.status(400).send(error);
    const image = `${destination}/${req.file.filename}`;
    const playlist = await Playlists.create({ user: _id, title, image });
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
    const found = await Playlists.findOne({ _id: playlist, user: _id }).exec();
    if (!found) return res.sendStatus(404);
    if (found.image) {
      FS.rm(path.resolve('public', found.image));
    }
    await Playlists.deleteOne({ _id: playlist });
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send(error);
  }
}

async function update(req, res) {
  try {
    const { _id } = req.user;
    const { playlist } = req.params;
    const found = await Playlists.findOne({ _id: playlist, user: _id });
    if (!found) return res.sendStatus(404);
    if (req.body.title) {
      found.title = req.body.title;
    }
    if (req.file) {
      if (found.image) {
        FS.rm(path.resolve('public', found.image));
      }
      found.image = `${destination}/${req.file.filename}`;
    }
    await found.save();
    return res.sendStatus(200);
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
    const found = await Playlists.find({ user: _id }, '-songs').exec();
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
    const found = await populatePlaylist(_id, playlist);
    if (!found.length) return res.sendStatus(404);
    return res.send(found[0]);
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
