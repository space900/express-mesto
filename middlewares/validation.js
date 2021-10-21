const { celebrate, Joi, CelebrateError } = require('celebrate');
const { isURL, isEmail } = require('validator');
const messages = require('../errors/messages');

module.exports.userValidation = celebrate({
  body: Joi.object.keys({
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
