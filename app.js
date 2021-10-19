const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
// eslint-disable-next-line no-unused-vars
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
});

app.use(helmet());
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '615b330494e76a795d48c9b3',
  };
  next();
});

app.use('/', usersRoutes);
app.use('/', cardsRoutes);
app.post('/signin', login);
app.post('/signup', createUser);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App is running on port ${PORT}`);
});
