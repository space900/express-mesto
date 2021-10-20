module.exports = {
  BAD_REQUEST_USER_SEARCH: { message: 'Запрашиваемый пользователь не найден' },
  BAD_REQUEST_USER_CREATE: { message: 'Переданы некорректные данные при создании пользователя' },
  BAD_REQUEST_USER_UPD: { message: 'Переданы некорректные данные при обновлении профиля' },
  BAD_REQUEST_AVATAR_UPD: { message: 'Переданы некорректные данные при обновлении аватара' },
  BAD_REQUEST_CARD: { message: 'Переданы некорректные данные' },
  NOT_FOUND: { message: 'Пользователь по указанному _id не найден' },
  NOT_FOUND_CARD: { message: 'Карточка с указанным _id не найдена' },
  INTERNAL_SERVER: { message: 'Произошла ошибка на сервере' },
  BAD_EMAIL_VALID: { message: 'Неправильный формат почты' },
  UNAUTH_REQUEST_DATA: { message: 'Указан неправильный логин или пароль' },
  BAD_REQUEST_CARD_DELETE: { message: 'Недостаточно прав для удаления карточки' },
  BAD_REQUEST_EMAIL_CREATE: { message: 'Данный email уже зарегистрирован' },
};
