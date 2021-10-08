/* eslint-disable arrow-body-style */
const Card = require('../models/card');
const messages = require('../errors/messages');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      return res.status(500).send(messages.INTERNAL_SERVER);
    });
};

// eslint-disable-next-line no-unused-vars
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  // eslint-disable-next-line no-console
  return Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send(messages.BAD_REQUEST_CARD);
      }
      return res.status(500).send(messages.INTERNAL_SERVER);
    });
};

// eslint-disable-next-line no-unused-vars
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send(messages.NOT_FOUND_CARD);
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send(messages.BAD_REQUEST_CARD);
      }
      return res.status(500).send(messages.INTERNAL_SERVER);
    });
};

// eslint-disable-next-line no-unused-vars
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (!card) {
        return res.status(404).send(messages.NOT_FOUND_CARD);
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send(messages.BAD_REQUEST_CARD);
      }
      return res.status(500).send(messages.INTERNAL_SERVER);
    });
};

// eslint-disable-next-line no-unused-vars
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (!card) {
        return res.status(404).send(messages.NOT_FOUND_CARD);
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send(messages.BAD_REQUEST_CARD);
      }
      return res.status(500).send(messages.INTERNAL_SERVER);
    });
};
