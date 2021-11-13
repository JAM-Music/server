const { protectRoute } = require('_middleware/auth');
const { getByArtist } = require('_controllers/albums.controller');

const router = require('express').Router();

router.use(protectRoute);
// Routes for this router
router.get('/artist/:artist', getByArtist);

module.exports = router;
