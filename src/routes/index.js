const albums = require('./albums.route');
const artists = require('./artists.route');
const genres = require('./genres.route');
const playlists = require('./playlists.route');
const songs = require('./songs.route');
const users = require('./users.route');

module.exports = [
  { path: '/albums', router: albums },
  { path: '/artists', router: artists },
  { path: '/genres', router: genres },
  { path: '/playlists', router: playlists },
  { path: '/songs', router: songs },
  { path: '/users', router: users },
];
