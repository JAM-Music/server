const users = require('./users.route');

module.exports = [
  { path: '/users', router: users },
];
