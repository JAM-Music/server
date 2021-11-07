require('module-alias/register');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const routes = require('_routes/index');
const debug = require('debug')('server:errors');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve('public')));

app.get('/', (req, res) => {
  res.render('index');
});

routes.forEach((route) => {
  app.use(route.path, route.router);
});

app.use((err, req, res, next) => {
  debug(err.name);
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid token');
    return;
  }
  next();
});

module.exports = app;
