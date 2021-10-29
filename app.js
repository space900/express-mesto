const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
// const cors = require('cors');
// eslint-disable-next-line no-unused-vars
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const NotFound = require('./errors/classes/notFound');
const messages = require('./errors/messages');
const { auth } = require('./middlewares/auth');
const { loginValidation, userValidation } = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
});

// app.use(cors);
app.use(requestLogger);

app.use(cookieParser());
app.use(helmet());
app.use(limiter);
app.use(express.json());

app.post('/signin', loginValidation, login);
app.post('/signup', userValidation, createUser);

app.use('/', auth, usersRoutes);
app.use('/', auth, cardsRoutes);

app.use('*', () => {
  throw new NotFound(messages.SERVER_NOT_FOUND);
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App is running on port ${PORT}`);
});
