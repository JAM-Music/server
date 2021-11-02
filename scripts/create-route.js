// eslint-disable-next-line import/no-extraneous-dependencies
const ect = require('ect');
const path = require('path');
const fs = require('fs');

// eslint-disable-next-line no-undef
const name = process.argv[2];

if (!name) {
  throw Error('Add a name to the page \'npm run create-page [name]\' ');
}

const values = {
  name,
};

const routesIndex = path.resolve('./routes');

const renderer = ect({ root: path.resolve(__dirname, 'schemas'), ext: '.ect' });

const route = renderer.render('route', values);
fs.writeFileSync(`${routesIndex}/${name}.route.js`, route);

const routes = fs
  .readdirSync(routesIndex, { withFileTypes: true })
  .filter((dirent) => dirent.name !== 'index.js')
  .map((dirent) => ({
    name: dirent.name.split('.')[0],
    path: dirent.name,
  }));

const content = renderer.render('index', { routes });
fs.writeFileSync(`${routesIndex}/index.js`, content);
