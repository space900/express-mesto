const { celebrate, Joi, CelebrateError } = require('celebrate');
const { isURL, isEmail } = require('validator');
const messages = require('../errors/messages');

module.exports.userValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value) => {
      if (!isURL(value)) {
        throw new CelebrateError(messages.BAD_EMAIL_VALID);
      }
      return value;
    }),
    email: Joi.string().required().custom((value) => {
      if (!isEmail(value)) {
        throw new CelebrateError(messages.BAD_EMAIL_VALID);
      }
      return value;
    }),
    password: Joi.string().required(),
  }),
});

module.exports.userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
});

module.exports.userAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((value) => {
      if (!isURL(value)) {
        throw new CelebrateError(messages.BAD_URL_VALID);
      }
      return value;
    }).required(),
  }),
});

module.exports.userInfoValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

module.exports.loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value) => {
      if (!isEmail(value)) {
        throw new CelebrateError(messages.BAD_EMAIL_VALID);
      }
      return value;
    }),
    password: Joi.string().required(),
  }),
});

module.exports.cardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().custom((value) => {
      if (!isURL(value)) {
        throw new CelebrateError(messages.BAD_URL_VALID);
      }
      return value;
    }),
  }),
});

module.exports.cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});
