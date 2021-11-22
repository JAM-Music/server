const { Types } = require('mongoose');
const Albums = require('_models/Albums');
const Artists = require('_models/Artists');
const Songs = require('_models/Songs');
const fs = require('fs');
const Recents = require('_models/Recents');

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
          { $unwind: '$author' },
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

async function recents(req, res) {
  const { _id } = req.user;
  const songs = await Recents.aggregate([
    { $match: { user: Types.ObjectId(_id) } },
    { $group: { _id: '$song', date: { $max: '$date' } } },
    { $sort: { date: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'songs',
        pipeline: [
          {
            $lookup: {
              from: 'albums',
              pipeline: [
                {
                  $lookup: {
                    from: 'artists',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                  },
                },
                { $unwind: '$author' },
              ],
              localField: 'album',
              foreignField: '_id',
              as: 'albums',
            },
          },
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
          { $unset: 'albums' },
        ],
        localField: '_id',
        foreignField: '_id',
        as: 'song',
      },
    },
    { $unwind: '$song' },
    { $set: { 'song.date': '$date' } },
    { $replaceRoot: { newRoot: '$song' } },
  ]);
  return res.send(songs);
}

async function play(req, res) {
  const { song } = req.params;
  const { _id } = req.user;
  const found = await Songs.findById(song);
  Recents.create({ user: _id, song });
  const music = `music/${found.filename}`;

  const stat = fs.statSync(music);
  const { range } = req.headers;
  let readStream;

  if (range !== undefined) {
    const parts = range.replace(/bytes=/, '').split('-');

    const partialStart = parts[0];
    const partialEnd = parts[1];

    if ((Number.isNaN(partialStart) && partialStart.length > 1)
    || (Number.isNaN(partialEnd) && partialEnd.length > 1)) {
      res.sendStatus(500); // ERR_INCOMPLETE_CHUNKED_ENCODING
      return;
    }

    const start = parseInt(partialStart, 10);
    const end = partialEnd ? parseInt(partialEnd, 10) : stat.size - 1;
    const contentLength = (end - start) + 1;

    res.status(206).header({
      'Content-Type': 'audio/mpeg',
      'Content-Length': contentLength,
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
    });

    readStream = fs.createReadStream(music, { start, end });
  } else {
    res.header({
      'Content-Type': 'audio/mpeg',
      'Content-Length': stat.size,
    });
    readStream = fs.createReadStream(music);
  }
  readStream.pipe(res);
}

module.exports = {
  getByGenre, search, getByAlbum, getByArtist, findSong, getById, play, recents,
};
