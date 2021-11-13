const {
  getByGenre, search, getByArtist, getByAlbum,
} = require('_controllers/songs.controller');
const { protectRoute } = require('_middleware/auth');

const router = require('express').Router();

router.use(protectRoute);
// Routes for this router
router.get('/genre/:genre', getByGenre);
router.get('/artist/:artist', getByArtist);
router.get('/album/:album', getByAlbum);
router.get('/', search);

module.exports = router;
