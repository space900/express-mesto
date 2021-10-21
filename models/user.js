const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const messages = require('../errors/messages');
const { UnauthorizedError } = require('../errors/classes');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    // validate: {
    //   // validator(v) {},
    // },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: messages.BAD_EMAIL_VALID,
    },
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
    select: false,
    validate: {
      validator(v) {
        return validator.isStrongPassword(v);
      },
      message: messages.TOO_EASY_PASSWORD,
    },
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(messages.UNAUTH_REQUEST_DATA));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError(messages.UNAUTH_REQUEST_DATA));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
