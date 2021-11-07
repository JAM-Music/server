const express = require('express');
const { protectRoute } = require('_middleware/auth');
const {
  register, login, formatUser, update, getUser,
} = require('_controllers/users.controller');
const router = express.Router();

router.get('/', protectRoute, getUser);
router.patch('/', protectRoute, update);
router.post('/register', register);
router.post('/login', login);
router.get('/session', protectRoute, (req, res) => res.status(200).send(formatUser(req.user)));

module.exports = router;
