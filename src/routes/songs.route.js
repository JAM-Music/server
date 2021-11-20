const {
  getByGenre, search, getByArtist, getByAlbum, getById, play, recents,
} = require('_controllers/songs.controller');
const { protectRoute } = require('_middleware/auth');

const router = require('express').Router();

router.use(protectRoute);
// Routes for this router
router.get('/play/:song', play);
router.get('/genre/:genre', getByGenre);
router.get('/artist/:artist', getByArtist);
router.get('/album/:album', getByAlbum);
router.get('/recents', recents);
router.get('/:song', getById);
router.get('/', search);

module.exports = router;
