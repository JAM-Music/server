const { Types } = require('mongoose');
const Albums = require('_models/Albums');
const Artists = require('_models/Artists');
const Songs = require('_models/Songs');

async function getByGenre(req, res) {
  try {
    const { genre } = req.params;
    if (!genre) {
      return res.sendStatus(400);
    }
    const songs = await Songs.find({ genre }).populate('album').populate('genre').exec();
    return res.send(songs);
  } catch (error) {
    return res.status(500).send(error);
  }
}

async function findSong(filter, options, sort) {
  const query = Songs.find(filter, options);
  if (sort) {
    query.sort(sort);
  }
  return query.populate('album').populate('genre')
    .populate({
      path: 'album',
      populate: {
        path: 'author',
        model: 'Artists',
      },
    })
    .exec();
}

async function search(req, res) {
  const { search: str } = req.query;
  const [songs, artists, albums] = await Promise.all([
    // eslint-disable-next-line no-useless-escape
    findSong({ $or: [{ $text: { $search: str } }, { title: { $regex: `\\.*${str}\\.*`, $options: 'gi' } }] }, { score: { $meta: 'textScore' } }, { score: { $meta: 'textScore' } }),
    Artists.find({ $text: { $search: str } }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } }).exec(),
    Albums.find({ $text: { $search: str } }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } }).populate('author').exec(),
  ]);
  res.send({
    songs,
    artists,
    albums,
  });
}

async function getByArtist(req, res) {
  const { artist } = req.params;
  if (!artist) return res.status(400).send({ artist: ['El atributo artist es obligatorio'] });
  const songs = await Songs.aggregate([
    {
      $lookup: {
        from: 'albums',
        pipeline: [
          { $match: { author: Types.ObjectId(artist) } },
          {
            $lookup: {
              from: 'artists',
              localField: 'author',
              foreignField: '_id',
              as: 'author',
            },
          },
        ],
        localField: 'album',
        foreignField: '_id',
        as: 'albums',
      },
    },
    { $match: { albums: { $size: 1 } } },
    {
      $lookup: {
        from: 'genres',
        localField: 'genre',
        foreignField: '_id',
        as: 'genre',
      },
    },
    { $unwind: '$albums' },
    { $unwind: '$genre' },
    { $set: { album: '$albums' } },
    { $unset: 'albums' }]);
  return res.send(songs);
}

async function getByAlbum(req, res) {
  const { album } = req.params;
  if (!album) return res.status(400).send({ artist: ['El atributo artist es obligatorio'] });
  const songs = await findSong({ album });
  return res.send(songs);
}

async function getById(req, res) {
  const { song } = req.params;
  if (!song) return res.status(400).send({ song: ['El atributo es obligatorio'] });
  const found = await findSong({ _id: song });
  if (!found?.length) return res.status(404);
  return res.send(found[0]);
}

module.exports = {
  getByGenre, search, getByAlbum, getByArtist, findSong, getById,
};
