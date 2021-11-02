module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'import/newline-after-import': 'off',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['_config', './config'],
          ['_controllers', './controllers'],
          ['_middleware', './middleware'],
          ['_models', './models'],
          ['_routes', './routes'],
          ['_utils', './utils'],
        ],
        extensions: ['.js', '.json'],
      },
    },
  },
};
