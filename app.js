const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const NotFoundError = require('./errors/not-found');
const { router } = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./utils/limiter');
const { errorHandler } = require('./middlewares/errorHandler');

const {
  PORT = process.env.PORT || 3000,
  DB_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/bitfilmsdb',
} = process.env;

mongoose.connect(DB_URL).then(() => {});

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(helmet());
app.use(limiter);

app.use(router);

app.use(errors());

app.use((req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});

app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT, () => {

});
