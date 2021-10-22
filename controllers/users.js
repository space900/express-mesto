const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

/* eslint-disable arrow-body-style */
const User = require('../models/user');
const messages = require('../errors/messages');
const BadRequest = require('../errors/classes/badRequest');
const UnauthorizedError = require('../errors/classes/unauthorizedError');
const NotFound = require('../errors/classes/notFound');
const ConflictError = require('../errors/classes/conflictError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ allUsers: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  return User.findById(req.params.userId)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        throw new NotFound(messages.NOT_FOUND);
      }
      return res.status(200).send({ userData: user });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest(messages.BAD_REQUEST_USER_SEARCH);
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(messages.BAD_REQUEST_EMAIL_CREATE);
      } else {
        return bcrypt.hash(password, 10);
      }
    })
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => {
        return res.status(200).send({
          name: user.name, about: user.about, avatar: user.avatar, email,
        });
      })
      // eslint-disable-next-line consistent-return
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequest(messages.BAD_REQUEST_USER_CREATE);
        } else {
          next(err);
        }
      }))
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const id = req.user._id;

  return User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest(messages.BAD_REQUEST_USER_UPD);
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const id = req.user._id;

  return User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest(messages.BAD_REQUEST_AVATAR_UPD);
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  // const { JWT_SECRET = 'super-strong-secret' } = process.env;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      }).send({ message: messages.SUCCESS_REQUEST_AUTH });
    })
    .catch(() => {
      throw new UnauthorizedError(messages.UNAUTH_REQUEST_DATA);
    })
    .catch(next);
};

module.exports.getCurrentUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound(messages.NOT_FOUND);
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest(err.message);
      }
      next(err);
    })
    .catch(next);
};
