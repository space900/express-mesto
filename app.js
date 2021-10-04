const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line no-unused-vars
const path = require('path');
const usersRoutes = require('./routes/users');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {});

// app.use(express.static(path.join(__dirname, 'public')));
app.use('/', usersRoutes);
// app.use(express.json());

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App is running on port ${PORT}`);
});
