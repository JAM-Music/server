const Users = require('_models/Users');
const { signJWT, hashPassword, comparePassword } = require('_utils/sessions');
const ValidateLogin = require('_validators/auth/login');
const ValidateRegister = require('_validators/auth/register');

function formatUser(user) {
  let userCopy = user;
  if (typeof user.toObject === 'function') {
    userCopy = user.toObject();
  }
  return {
    first_name: userCopy.first_name,
    last_name: userCopy.last_name,
    token: userCopy.token,
    email: userCopy.email,
  };
}

async function register(req, res) {
  try {
    await ValidateRegister(req.body);
    const password = await hashPassword(req.body.password);
    req.body.password = password;
    const user = await Users.create(req.body);
    const token = signJWT(user.toObject());
    res.send({
      ...formatUser(user),
      token,
    });
  } catch (error) {
    res.status(400).send(error);
  }
}

async function login(req, res) {
  try {
    await ValidateLogin(req.body);
    const user = await Users.findOne({ email: req.body.email }).exec();
    if (!user) {
      return res.status(401).send('El correo y/o la contraseña son incorrectos');
    }
    const password = await comparePassword(req.body.password, user.password);
    if (!password) {
      return res.status(401).send('El correo y/o la contraseña son incorrectos');
    }
    const token = signJWT(user.toObject());
    return res.send({
      ...formatUser(user),
      token,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
}

async function update(req, res) {
  try {
    await ValidateRegister(req.body);
    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }
    // eslint-disable-next-line no-underscore-dangle
    const user = await Users.findByIdAndUpdate(req.user._id, req.body, { new: true }).exec();
    const token = signJWT(formatUser(user));
    return res.send({
      ...formatUser(user),
      token,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
}

async function getUser(req, res) {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const user = await Users.findById(req.user._id).exec();
    return res.send(formatUser(user));
  } catch (error) {
    return res.status(500).send(error);
  }
}

module.exports = {
  register, login, formatUser, update, getUser,
};
