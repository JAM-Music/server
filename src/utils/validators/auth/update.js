const Validator = require('validatorjs');

const rules = {
  email: 'email|email_available',
  first_name: 'string',
  last_name: 'string',
  password: 'string',
};

function ValidateRegister(obj) {
  return new Promise((resolve, reject) => {
    const validator = new Validator(obj, rules);
    validator.checkAsync(resolve, () => reject(validator.errors.all()));
  });
}

module.exports = ValidateRegister;
