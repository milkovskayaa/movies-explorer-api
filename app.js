const express = require('express');
const mongoose = require('mongoose');
const NotFoundError = require('./errors/not-found');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
}).then(() => {
});

app.use((req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});

app.use((err, req, res) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {

});
