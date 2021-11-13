const { getAll } = require('_controllers/genres.controller');
const { protectRoute } = require('_middleware/auth');

const router = require('express').Router();

router.use(protectRoute);

// Routes for this router
router.get('/', getAll);

module.exports = router;
