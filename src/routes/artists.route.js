const router = require('express').Router();
const { getAll } = require('_controllers/artists.controller');
const { protectRoute } = require('_middleware/auth');

router.use(protectRoute);
// Routes for this router
router.get('/', getAll);

module.exports = router;
