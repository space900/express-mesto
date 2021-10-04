const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

// eslint-disable-next-line no-unused-vars
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  // eslint-disable-next-line no-console
  console.log(req.user._id);
  Card.create({ name, link })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// eslint-disable-next-line no-unused-vars
module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId);
};
