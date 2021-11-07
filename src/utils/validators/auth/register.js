const Validator = require('validatorjs');
const Users = require('_models/Users');

Validator.registerAsync('email_available', async (email, attribute, req, passes) => {
  const found = await Users.findOne({ email }).exec();
  if (found) {
    passes(false, 'El correo ya se encuentra en uso');
  }
  passes();
});

const rules = {
  email: 'required|email|email_available',
  first_name: 'required|string',
  last_name: 'required|string',
  password: 'required|string',
};

function ValidateRegister(obj) {
  return new Promise((resolve, reject) => {
    const validator = new Validator(obj, rules);
    validator.checkAsync(resolve, () => reject(validator.errors.all()));
  });
}

module.exports = ValidateRegister;
