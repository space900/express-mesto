// eslint-disable-next-line max-classes-per-file
class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequest';
    this.statusCode = 400;
  }
}

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InternalServerError';
    this.statusCode = 500;
  }
}

class NotFound extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFound';
    this.statusCode = 404;
  }
}

module.exports = {
  BadRequest,
  InternalServerError,
  NotFound,
};

module.exports = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
};

module.exports = {
  BAD_REQUEST: 'Переданы некорректные данные',
  NOT_FOUND: 'Объект не найден',
  INTERNAL_SERVER: 'Произошла ошибка на сервере',
};
