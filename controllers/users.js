const User = require('../models/user');

const BadRequestError = require('../errors/bad-request');
// const ConflictError = require('../errors/conflict');
const NotFoundError = require('../errors/not-found');
// const UnauthorizedError = require('../errors/unauthorized');

// возвращает информацию о пользователе
const getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(200).send(user);
    })
    .catch((err) => next(err));
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(BadRequestError('Введены некорректные данные'));
        return;
      }
      next(err);
    });
};

module.exports = {
  getUserInfo,
  updateProfile,
};
