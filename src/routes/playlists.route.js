const { multerDiskStorage } = require('_config/multer');
const {
  getByUser, getById, update, addSong, removeSong, create, remove,
} = require('_controllers/playlists.controller');
const { protectRoute } = require('_middleware/auth');
const upload = require('multer')({ storage: multerDiskStorage });
const router = require('express').Router();

router.use(protectRoute);
// Routes for this router
router.get('/:playlist', getById);
router.get('/', getByUser);

router.patch('/:playlist', upload.single('image'), update);

router.post('/:playlist/song/:song', addSong);
router.post('/', upload.single('image'), create);

router.delete('/:playlist/song/:song', removeSong);
router.delete('/:playlist', remove);

module.exports = router;
