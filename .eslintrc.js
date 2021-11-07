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
          ['_config', './src/config'],
          ['_controllers', './src/controllers'],
          ['_middleware', './src/middleware'],
          ['_models', './src/models'],
          ['_routes', './src/routes'],
          ['_validators', './src/utils/validators'],
          ['_utils', './src/utils'],
        ],
        extensions: ['.js', '.json'],
      },
    },
  },
};
