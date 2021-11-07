const jwt = require('jsonwebtoken');
const { secret } = require('_config/jwt');
const bcrypt = require('bcrypt');

exports.signJWT = (payload, expiresIn = '30d') => jwt.sign(payload, secret, { expiresIn });
exports.hashPassword = (password) => new Promise(
  (resolve, reject) => bcrypt.hash(password, 8, (err, hash) => {
    if (err) return reject(err);
    return resolve(hash);
  }),
);
exports.comparePassword = (password, hash) => new Promise(
  (resolve, reject) => bcrypt.compare(password, hash, (err, res) => {
    if (err) return reject(err);
    return resolve(res);
  }),
);
