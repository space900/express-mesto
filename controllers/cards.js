/* eslint-disable consistent-return */
/* eslint-disable arrow-body-style */
const Card = require('../models/card');
const messages = require('../errors/messages');
const { BadRequest } = require('../errors/classes/badRequest');
const NotFound = require('../errors/classes/notFound');
const ForbiddenError = require('../errors/classes/forbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest(messages.BAD_REQUEST_CARD);
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const id = req.user._id;
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound(messages.NOT_FOUND_CARD);
      }
      if (card.owner.toString() !== id) {
        throw new ForbiddenError(messages.BAD_REQUEST_CARD_DELETE);
      } else {
        Card.findByIdAndRemove(req.params.cardId)
          // eslint-disable-next-line no-shadow
          .then((card) => res.send(card));
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
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
        throw new BadRequest(messages.BAD_REQUEST_CARD);
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
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
        throw new BadRequest(messages.BAD_REQUEST_CARD);
      } else {
        next(err);
      }
    })
    .catch(next);
};
