const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* eslint-disable arrow-body-style */
const User = require('../models/user');
const messages = require('../errors/messages');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => {
      return res.status(500).send(messages.INTERNAL_SERVER);
    });
};

module.exports.getUserById = (req, res) => {
  return User.findById(req.params.userId)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return res.status(404).send(messages.NOT_FOUND);
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send(messages.BAD_REQUEST_USER_SEARCH);
      }
      return res.status(500).send(messages.INTERNAL_SERVER);
    });
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
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return res.status(400).send(messages.BAD_REQUEST_USER_CREATE);
        }
        return res.status(500).send(messages.INTERNAL_SERVER);
      }))
    .catch(next);
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;

  return User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send(messages.NOT_FOUND);
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send(messages.BAD_REQUEST_USER_UPD);
      }
      return res.status(500).send(messages.INTERNAL_SERVER);
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;

  return User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send(messages.BAD_REQUEST_AVATAR_UPD);
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(404).send(messages.BAD_REQUEST_AVATAR_UPD);
      }
      return res.status(500).send(messages.INTERNAL_SERVER);
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, '123123', { expiresIn: '7d' });
      res.send({ token });
    });
};
