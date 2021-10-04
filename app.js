const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line no-unused-vars
const path = require('path');
const { createUser } = require('./controllers/users');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {});

// app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.post('/', createUser);

app.use('/', usersRoutes);
app.use('/', cardsRoutes);

app.use((req, res, next) => {
  req.user = {
    _id: '615b330494e76a795d48c9b3',
  };
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App is running on port ${PORT}`);
});
