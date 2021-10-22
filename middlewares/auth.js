const jwt = require('jsonwebtoken');
const messages = require('../errors/messages');
const UnauthorizedError = require('../errors/classes/unauthorizedError');
// const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports.auth = (req, res, next) => {
  // const { authorization } = req.headers;
  const { JWT_SECRET = 'super-strong-secret' } = process.env;

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError(messages.BAD_REQUEST_AUTH);
  }

  req.user = payload;

  next();
};
