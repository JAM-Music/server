const mongoose = require('mongoose');
const debug = require('debug')('server:db');

mongoose.set('debug', !!process.env.DBLOGGIN);

const db = {
  uri: process.env.MONGODB_URI,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  },
};

async function connectDB() {
  debug.color = '\x1B[33';
  await mongoose.connect(db.uri, db.options).catch((e) => {
    debug('Error en la conexión con la base de datos %s', e);
  });
  debug('Conexión con la base de datos establecida');
}

module.exports = {
  ...db,
  connectDB,
};
