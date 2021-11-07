const Validator = require('validatorjs');
const { connectDB } = require('./db');

async function initServices() {
  connectDB();
  Validator.useLang('es');
}

module.exports = initServices;
