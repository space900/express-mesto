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

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => {
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send(messages.BAD_REQUEST_USER_CREATE);
      }
      return res.status(500).send(messages.INTERNAL_SERVER);
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;

  return User.findByIdAndUpdate(id, { name, about })
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

  return User.findByIdAndUpdate(id, { avatar })
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
