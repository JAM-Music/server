const Validator = require('validatorjs');

const rules = {
  email: 'required|email',
  password: 'required|string',
};

function ValidateLogin(obj) {
  return new Promise((resolve, reject) => {
    const validator = new Validator(obj, rules);
    validator.checkAsync(resolve, () => reject(validator.errors.all()));
  });
}

module.exports = ValidateLogin;
