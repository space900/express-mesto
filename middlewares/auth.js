const jwt = require('jsonwebtoken');
const messages = require('../errors/messages');
const { UnauthorizedError } = require('../errors/classes');
// const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports.auth = (req, res, next) => {
  const authorization = req.headers;
  const extractBearerToken = authorization.replace('Bearer', '');
  const { JWT_SECRET = 'super-strong-secret' } = process.env;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(messages.BAD_REQUEST_AUTH);
  }

  const token = extractBearerToken;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError(messages.BAD_REQUEST_AUTH);
  }

  req.user = payload;

  next();
};
