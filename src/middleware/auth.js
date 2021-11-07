const jwt = require('express-jwt');
const { secret } = require('_config/jwt');

exports.protectRoute = jwt({ secret, algorithms: ['HS256'] });
