const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* eslint-disable arrow-body-style */
const User = require('../models/user');
const messages = require('../errors/messages');
const { UnauthorizedError } = require('../errors/classes');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  return User.findById(req.params.userId)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return res.status(404).send(messages.NOT_FOUND);
      }
      return res.status(200).send(user);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send(messages.BAD_REQUEST_USER_SEARCH);
      }
      next(err);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => {
        return res.status(200).send(user);
      })
      // eslint-disable-next-line consistent-return
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return res.status(400).send(messages.BAD_REQUEST_USER_CREATE);
        }
        next(err);
      }))
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const id = req.user._id;

  return User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send(messages.NOT_FOUND);
      }
      return res.status(200).send(user);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send(messages.BAD_REQUEST_USER_UPD);
      }
      next(err);
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const id = req.user._id;

  return User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send(messages.BAD_REQUEST_AVATAR_UPD);
      }
      return res.status(200).send(user);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(404).send(messages.BAD_REQUEST_AVATAR_UPD);
      }
      next(err);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const { JWT_SECRET = 'super-strong-secret' } = process.env;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      throw new UnauthorizedError(messages.UNAUTH_REQUEST_DATA);
    })
    .catch(next);
};
